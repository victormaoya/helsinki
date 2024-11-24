import {useState, useEffect} from 'react'
import axios from 'axios'
import Country from './components/Country'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  const api_key = import.meta.env.VITE_OPEN_WEATHER

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response =>
        setCountries(response.data)
      )
  }, [])

  const handleChange = (event) => {
    setQuery(event.target.value)
    setSelectedCountry(null)
  }

  const handleClick = (country) => {
    setSelectedCountry([country])
  }

  const filteredCountries =
    countries.filter(
      country => country.name.common.toLowerCase().includes(query.toLowerCase())
    )

  const countriesToShow = () => {
    if (filteredCountries.length > 10) {
      return (
        <div className='message'>Too many matches, specify another filter</div>
      )
    } else if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
      return (
        <div className='country-list'>
          {filteredCountries.map(country => (
            <div key={country.cca3} className='country-item'>
              {country.name.common}&nbsp;
              <button onClick={() => handleClick(country)}>show</button>
            </div>
          ))}
        </div>
      )
    } else if (filteredCountries.length === 1) {
      return <Country apiKey={api_key} filtered={filteredCountries} />
    } else {
      return <div className='message'>Country not found</div>
    }
  }

  return (
    <div className='app-container'>
      <div className='search-container'>
        <label htmlFor='search'><b>Find countries</b></label>
        <input
          id='search'
          type='text'
          value={query}
          onChange={handleChange}
          placeholder='Enter country name'  
        />
      </div>
      {query && countriesToShow()}
      {selectedCountry && <Country apiKey={api_key} filtered={selectedCountry} />}
    </div>
  )
}

export default App