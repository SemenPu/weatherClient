import React, { useState, useEffect } from 'react'
import { AlertPopup } from './components/AlertPopup/AlertPopup'
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
  const [dayData, setDayData] = useState([])
  const [status, setStatus] = useState(100)
  const [cityData, setCityData] = useState('')
  const [fetching, setFetching] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [desc, setDesc] = useState('')

  const reg = /[A-Za-zА-Яа-яё.,]/

  useEffect(() => {
    // func success, func error, {options}
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true, maximumAge: 0 })
    // eslint-disable-next-line
  }, [])

  function successLocation(locObj) {
    sendCoordRequest(locObj.coords.latitude, locObj.coords.longitude)
  }
  function errorLocation(desc) {
    showAlertHandler(`Ошибка геолокации/${desc}`)
  }
  async function sendNameRequest(caller) {
    console.log(caller)
    if (loading === true) return showAlertHandler('Загрузка данных')
    const url = `/data/getData?cityName=${value}`
    if (value.length < 1) return showAlertHandler('Не введли город')
    if (value.length < 4) return showAlertHandler('Длина менее 4 символов')
    setLoading(true)
    if (fetching) return
    await loadingDataHandler(url)
  }
  async function sendCoordRequest(latitude = null, longitude = null) {
    if (loading === true) return
    const url = `/data/getCoordData?lat=${latitude}&lon=${longitude}`
    setLoading(true)
    if (fetching) return
    await loadingDataHandler(url)
  }
  async function loadingDataHandler(url) {
    try {
      setFetching(true)
      const data = await getData(url)
      if (data instanceof Error) throw new Error(data)
      const daysData = dataObjectConstructor(data.list, data.city.sunrise, data.city.sunset)
      const week = createCurrentWeek(daysData)
      setData(daysData)
      setMyWeek(week)
      setDayData(daysData[Object.keys(daysData)[0]])
      setCityData(cityObjectConstructor(data))
      setStatus(200)
    } catch (e) {
      showAlertHandler(`Ошибка загрузки/${e}`)
      setDefaultStates()
    }
    setLoading(false)
    setFetching(false)
  }
  function setDefaultStates() {
    setValue('')
    setData([])
    setMyWeek([])
    setDayData([])
    setStatus(100)
    setCityData('')
  }
  function formValueHandler(val) {
    if (val[val.length - 1] === ' ') return setValue(val)
    if (val[val.length - 1] === '-') return setValue(val)
    if (val.length < 1) return setValue('')
    if (val[val.length - 1].match(reg) !== null) return setValue(val)
    return setValue(value)
  }
  function changeDayHandler(index) {
    setDayData(data[`day_${index}`])
  }
  function showAlertHandler(text) {
    setShowAlert(true)
    setDesc(text)
    setTimeout(() => {
      setShowAlert(false)
      setDesc('')
    }, 3800)
  }

  return (
    <React.Fragment>
      <div className='all__hieght_blur' />
      <div className='logo' />
      <AlertPopup show={showAlert} desc={desc} />
      <header>
        <div className='city_search'>
          <label htmlFor='searchInput'>Введите название города</label>
          <form onSubmit={e => { e.preventDefault(); }} >
            <SearchInput onType={e => formValueHandler(e.target.value)} val={value} inputId='searchInput' />
            <SearchButton sendRequest={() => sendNameRequest('sb')} />
          </form>
        </div>
      </header>
      <div className='content'>
        <div className='data__container'>
          {loading ? <Loader />
            : status === 200
              ? <WeatherData week={myWeek} dayData={dayData} cityData={cityData} changeDay={changeDayHandler} />
              : false}
        </div>
      </div>
      <footer>
        <div className='footer__info' >
          Информационный текст и т.п. 2021&copy;
          </div>
      </footer>
    </React.Fragment >
  )
}

export default App
