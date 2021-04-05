import React, { useEffect, useState } from 'react'
import { PopupData } from '../PopupData/PopupData'
import { Slider } from '../Slider/Slider'

export const WeatherData = ({ cityName, data, cityData }) => {
    const [currentDay, setCurrentDay] = useState(0)
    const [daysKey, setDaysKey] = useState('')
    const [days, setDays] = useState([])
    const [selectedDay, setSelectedDay] = useState(0)
    const [popupShow, setPopupShow] = useState(false)

    const monthNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']

    useEffect(createLocalWeek, [data])
    useEffect(() => setDaysKey(Object.keys(data)), [data])
    useEffect(() => setCurrentDay(daysKey[0]), [daysKey])
    // useEffect(() => console.log(data), [data])

    function createLocalWeek() {
        setDays([])
        for (let value in data) {
            // console.log(value)
            setDays(prev => [...prev, data[value][0].dayName])
        }
    }

    function daySelectHandler(i) {
        setCurrentDay(daysKey[i])
        setSelectedDay(i)
        cityInfoRender()
    }

    function cityInfoRender() {
        const currentMonth = monthNames[new Date(Date.now()).getMonth()]
        const minArr = []
        const maxArr = []
        Array.from(data[currentDay]).forEach(item => {
            minArr.push(item.temp.min)
            maxArr.push(item.temp.max)
        })
        const min = Math.round(Math.min(...minArr))
        const max = Math.round(Math.max(...maxArr))
        return (
            <div className='day__block_info'>
                <div className='block__info_first_row'>
                    {days[selectedDay]}, {currentDay} {currentMonth}.
                </div>
                <div className='block__info_additional_row'>
                    <i>Минимальная температура </i> {min}&deg;
                </div>
                <div className='block__info_additional_row'>
                    <i>Максимальная температура </i> {max}&deg;
                </div>
            </div>
        )
    }
    function popupShowHandler() {
        setPopupShow(false)
    }

    return (
        <React.Fragment>
            <h2 onClick={() => setPopupShow(true)}>{cityName}&nbsp;&#9776;</h2>
            <PopupData
                show={popupShow}
                country={cityData.country}
                lat={cityData.lat}
                lon={cityData.lon}
                timezone={cityData.timezone}
                sunrise={cityData.sunrise}
                sunset={cityData.sunset}
                population={cityData.population}
                onclick={popupShowHandler}
            />
            <div className='weather__days_select'>
                {days.length > 0
                    ? days.map((day, index) => (
                        index === selectedDay
                            ? <div key={index} className='day__name day__name_selected' onClick={() => daySelectHandler(index)}>
                                {day} </div>
                            : <div key={index} className='day__name' onClick={() => daySelectHandler(index)}>
                                {day} </div>
                    )) : false}
            </div>
            {data && currentDay && cityInfoRender()}
            {currentDay !== 0
                ? <Slider data={data[currentDay]} sunrise={cityData.handledSunrise} sunset={cityData.handledSunset} />
                : <h3>Loading . . . </h3>}

        </React.Fragment>
    )
}
