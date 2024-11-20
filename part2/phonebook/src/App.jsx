import { useState } from 'react'
import Filter  from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number : '12-43-234345', id: 3},
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
    { name: 'Elon Musk', number: '0725-522-488', id: 5 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])

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