const Persons = ({ query, persons, filteredPersons, deletePerson }) => {
  return (
    <div>
      {query === '' ? (
        persons.map(person => (
          <div key={person.name}>
            {person.name} {person.number}&nbsp;
            <button 
              onClick={() => 
                confirm(`Delete ${person.name}?`) 
                ? deletePerson(person.id) 
                : ''}
            >
              delete
            </button>
          </div>
        ))
      ) : (
        filteredPersons.map(person => (
          <div key={person.name}>
            {person.name} {person.numer}
          </div>
        ))
      )}
    </div>
  )
}

export default Persons