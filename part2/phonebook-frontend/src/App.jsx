import { useState, useEffect } from 'react';

import personService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';


const App = () => {
  const [persons, setPersons] = useState([]);
  const [person, setPerson] = useState({ name: '', number: '' });
  const [query, setQuery] = useState('');
  const [notification, setNotification] = useState({ message: '', isError: false, });

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((error) => {
        console.log('could not retrieve the contacts:', error.message);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPerson({ ...person, [name]: value });
  };

  const handleSearch = (event) => {
    setQuery(event.target.value.toLowerCase());
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((p) => p.name === person.name);
    const personObject = { ...person };

    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${person.name} is already added to the phonebook, replace the old number with a new one?`
      );

      if (confirmReplace) {
        personService
          .update(existingPerson.id, {
            ...existingPerson,
            number: person.number,
          })
          .then((updatedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id === updatedPerson.id ? updatedPerson : p
              )
            );
            showNotification(`${person.name}'s number updated!`);
          })
          .catch((error) => {
            console.log(error.message)
            showNotification(
              `Information of ${person.name} has already been removed from the server`,
              true
            );
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
          });
      }
    } else {
      personService
        .create(personObject)
        .then((createdPerson) => {
          setPersons(persons.concat(createdPerson));
          showNotification(`${createdPerson.name} added!`, false);
        })
        .catch((error) => {
          showNotification(
            error.response?.data?.error || 'Failed to add person',
            true
          );
        });
    }
    resetForm();
  };

  const deletePerson = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    const confirmDelete = window.confirm(`Delete ${personToDelete?.name}?`);

    if (confirmDelete) {
      personService
        .deletion(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showNotification(`${personToDelete.name} deleted!`, true);
        })
        .catch((error) => {
          console.log(error.message)
          showNotification(`Failed to delete ${personToDelete?.name}`, true);
        });
    }
  };

  const resetForm = () => {
    setPerson({ name: '', number: '' });
  };

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification({ message: '', isError: false }), 5000);
  };

  const filteredPersons = persons.filter((p) =>
    p.name.toLowerCase().includes(query)
  );

  return (
    <div className='container'>
      <h1>Phonebook</h1>
      <div className='content'>
        <Notification
          message={notification.message}
          isError={notification.isError}
        />
        <Filter
          query={query} 
          handleSearch={handleSearch}
        />

        <h3>Add a new person</h3>
        <PersonForm
          addPerson={addPerson}
          person={person}
          handleChange={handleChange}
        />

        <h2>Numbers</h2>
        <Persons
          query={query}
          persons={persons}
          filteredPersons={filteredPersons}
          deletePerson={deletePerson}
        />
      </div>
    </div>
  );
};

export default App;
