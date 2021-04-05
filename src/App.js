import React, { useState, useEffect } from 'react'
import { Loader } from './components/Loader/Loader'
import { SearchButton } from './components/SearchButton/SearchButton'
import { SearchInput } from './components/SearchInput/SearchInput'
import { WeatherData } from './components/WeatherData/WeatherData'
import { getData, dataObjectConstructor, cityObjectConstructor, createCurrentWeek } from './handlers/dataHandler.js'


function App() {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')
  const [data, setData] = useState([])
  const [myWeek, setMyWeek] = useState()
  const [weekData, setWeekData] = useState([])
  const [status, setStatus] = useState(100)
  const [cityData, setCityData] = useState('')
  const [fetching, setFetching] = useState(false)

  const reg = /[A-Za-zА-Яа-яё.,]/

  useEffect(() => {
    // func success, func error, {options}
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true, maximumAge: 0 })
    // eslint-disable-next-line
  }, [])

  // useEffect(() => {
  //   if (Object.keys(data).length > 0) {
  //     // console.log(data)
  //     console.log(createCurrentWeek(Object.keys(data)))
  //   }
  // }, [data])

  function successLocation(locObj) {
    setRequest(true, locObj.coords.latitude, locObj.coords.longitude)
  }
  function errorLocation(desc) {
    console.log(desc)
  }

  async function setRequest(coordGet = false, latitude = null, longitude = null) {
    if (loading === true) return
    const url = coordGet ? `/data/getCoordData?lat=${latitude}&lon=${longitude}` : `/data/getData?cityName=${value}`
    setLoading(true)
    try {
      if (value.length < 3 && !coordGet) return
      if (fetching) return
      setFetching(true)
      const data = await getData(url)
      const daysData = dataObjectConstructor(data.list, data.city.sunrise, data.city.sunset)
      const week = createCurrentWeek(Object.keys(daysData))
      // console.log(week)
      setData(daysData)
      setMyWeek(week)
      setWeekData(daysData[Object.keys(daysData)[0]])
      setCityData(cityObjectConstructor(data))
      setStatus(200)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
    setFetching(false)
  }

  function formValueHandler(val) {
    if (val[val.length - 1] === ' ') return setValue(val)
    if (val[val.length - 1] === '-') return setValue(val)
    if (val.length < 1) return setValue('')
    if (val[val.length - 1].match(reg) !== null) return setValue(val)
    return setValue(value)
  }

  return (
    <React.Fragment>
      <header>
        <div className='city_search'>
          <label htmlFor='searchInput'>Введите название города</label>
          <form onSubmit={e => { e.preventDefault(); setRequest() }} >
            <SearchInput onType={e => formValueHandler(e.target.value)} val={value} inputId='searchInput' />
            <SearchButton sendRequest={() => setRequest()} />
          </form>
        </div>
      </header>
      <div className='content'>
        <div className='data__container'>
          {
            loading ? <Loader />
              : status === 200
                ? <WeatherData week={myWeek} data={weekData} cityData={cityData} changeWeek={() => console.log()} />
                : status === 400 && <h2> Ошибка загрузки данных</h2>
          }
        </div>
      </div>
      <footer>
        <div className='footer__info'>
          Информационный текст и т.п. 2021&copy;
          </div>
      </footer>
    </React.Fragment >
  )
}

export default App
