import { useState, useEffect } from 'react'
import axios from 'axios'

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
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        const persons = response.data
        setPersons(persons)
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

    persons.find(person => person.name === newName)
      ? alert(`${newName} is already added to the phonebook`)
      : setPersons(persons.concat(personObject))

    setNewName('')
    setNewNumber('')
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
      />      
    </div>
  )
}

export default App