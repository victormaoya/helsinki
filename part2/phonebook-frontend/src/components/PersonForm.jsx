const PersonForm = ({ addPerson, person, handleChange }) => (
  <form onSubmit={addPerson}>
    <div>
      <label>
        Name:
        <input
          type='text'
          name='name'
          value={person.name}
          onChange={handleChange}
          placeholder='Enter name'
          required
        />
      </label>
    </div>
    <div>
      <label>
        Number:
        <input
          type='tel'
          name='number'
          value={person.number}
          onChange={handleChange}
          placeholder='Enter phone number'
          title='Please enter a valid phone number (e.g., +1234567890 or +1 (234) 567-8900)'
          required
        />
      </label>
    </div>
    <div>
      <button type='submit' aria-label='Add person'>Add</button>
    </div>
  </form>
)

export default PersonForm