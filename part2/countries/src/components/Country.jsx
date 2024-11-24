import {useState, useEffect} from 'react'
import axios from 'axios'

const Country = ({apiKey, filtered}) => {
  const [weatherData, setWeatherData] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  const city = filtered?.[0]?.capital?.[0] || ''

  useEffect(() => {
    if (city) {
      axios
      .get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
      .then(response => {
        const data = response.data
      
        if (data.length > 0) {
          setLatitude(data[0].lat)
          setLongitude(data[0].lon)
        }
      })
      .catch(error => console.error('Geocoding API error: ', error))
    }
  }, [apiKey, city])

  useEffect(() => {
    if (latitude && longitude) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(response => {
          const data = response.data
          setWeatherData(data)
        })
    }
  }, [apiKey, latitude, longitude])

  if (!weatherData) {
    return null
  }

  const iconUrl = weatherData.weather?.[0]?.icon
    ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
    : null;

  return (
    <div>
      {filtered.map(country => (
        <div key={country.cca3}>
          <h1>{country.name.common}</h1>
          <div>
            <h3>Capital(s)</h3>
            <ul>
            {country.capital.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
            </ul>
          </div>
          <br />
          <div><b>Area: </b>{country.area} sq. km.</div>
          <div><b>Population: </b>{country.population}</div>
          <div>
            <b>Currency: </b>
            {country.currencies 
            ? `${Object.values(country.currencies)[0].name} (${Object.values(country.currencies)[0].symbol})`
            : 'No currency vailable'}
          </div>

          <h3>Languages</h3>
          <ul>
          {Object.values(country.languages).map((language, index) => (
            <li key={index}>{language}</li>
          ))}
          </ul>
          <div>
            <img src={country.flags.png} alt={`${country.name.common} flag`} />
          </div>

          <h2>{`Weather in ${country.capital}`}</h2>
          <div className='weather-card'>
          {iconUrl && 
            <img 
              className='weather-icon' 
              src={iconUrl} 
              alt='weather icon' 
            />
          }

          <div className='weather-info'>
          {weatherData.main && (
            <div className='weather-temp'>
              <b>Temparature: </b>{weatherData.main.temp} &deg;C
            </div>
          )}
          {weatherData.wind && (
            <div className='weather-wind'>
              <b>Wind: </b>{weatherData.wind.speed} m/s
            </div>          
          )}
          </div>     
          </div>
        </div>
      ))}
    </div>
  )
}

export default Country