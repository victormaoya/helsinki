const Filter = ({query, handleSearch}) => {
  return (
    <div>
      filter shown with: <input
        value={query}
        onChange={handleSearch}
      />
    </div>
  )
}

export default Filter