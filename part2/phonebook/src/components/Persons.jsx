const Persons = ({ query, persons, filteredPersons }) => {
  return (
    <div>
      {query === '' ? (
        persons.map(person => (
          <div key={person.name}>
            {person.name} {person.number}
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