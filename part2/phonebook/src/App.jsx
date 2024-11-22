import { useState, useEffect } from 'react'
import personsService from './services/persons'
import Filter  from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])

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

  const updatePerson = id => {
    const person = persons.find(p => p.id === id)
    const changedPerson = { ...person, number: newNumber }

    personsService
      .update(id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id === id ? returnedPerson : person))
      })
  }

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    const person = persons.find(p => p.name == newName)
    const id = person.id

    if (person) {
      confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      ? updatePerson(id)
      : ''
    } else {
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
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