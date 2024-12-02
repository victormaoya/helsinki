const Persons = ({ query, persons, filteredPersons, deletePerson }) => {
  const displayedPersons = query === '' ? persons : filteredPersons

  return (
    <div>
      {displayedPersons.map(person => (
        <div key={person.id} className='person-item'>
          <span>{person.name} ⦁ {person.number}</span>
          <button 
            onClick={() => deletePerson(person.id)}
            aria-label={`Delete ${person.name}`}
          >
            delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default Persons