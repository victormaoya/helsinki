import { useState, useEffect } from 'react'
import personsService from './services/persons'
import Filter  from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])
  const [notification, setNotification] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (e) => {
    const entry = e.target.value.toLowerCase()
    setQuery(entry)
    
    const filtered = persons.filter(person => (
      person.name.toLowerCase().includes(entry)
    ))
    setFilteredPersons(filtered)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmReplace) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }

        const id = existingPerson.id

        personsService
          .update(`${id}`, updatedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(person =>
                person.id === returnedPerson.id ? returnedPerson : person
              )
            )
          })
          .catch(error => {
            setNotification(`Information of ${newName} has already been removed from the server`)
            setPersons(persons.filter(person => person.id !== id))
            setErrorMessage(true)
          })
      }
    } else {
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
    }
    setErrorMessage(false)
    setNotification(`${newName} added!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = id => {
    personsService
      .deletion(id)
      .then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== returnedPerson.id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification 
        message={notification}
        errorMessage={errorMessage}
      />
      <Filter
        query={query}
        handleSearch={handleSearch}
      />

      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />      

      <h2>Numbers</h2>
      <Persons 
        query={query}
        persons={persons}
        filteredPersons={filteredPersons}
        deletePerson={deletePerson}
      />      
    </div>
  )
}

export default App