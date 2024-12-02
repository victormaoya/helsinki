const Filter = ({ query, handleSearch }) => (
  <div>
    <label>
      Filter shown with:
      <input
        type='text'
        value={query}
        onChange={handleSearch}
      />
    </label>
  </div>
)

export default Filter