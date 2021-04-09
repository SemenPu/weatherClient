import React, { useState } from 'react'
import { PopupData } from '../PopupData/PopupData'
import { Slider } from '../Slider/Slider'

export const WeatherData = ({ dayData, cityData, week, changeDay }) => {
    const [selectedDay, setSelectedDay] = useState(1)
    const [popupShow, setPopupShow] = useState(false)

    function cityInfoRender() {
        const minArr = []
        const maxArr = []
        dayData.forEach(item => {
            minArr.push(item.temp.min)
            maxArr.push(item.temp.max)
        })
        const min = Math.min(...minArr)
        const max = Math.max(...maxArr)
        return (<div className='day__block_info'>
            <div className='block__info_first_row'>
                {dayData[0].dayName}, {dayData[0].date} {dayData[0].monthName}.
                </div>
            <div className='block__info_additional_row'>
                <i>Минимальная температура </i> {min}&deg;
                </div>
            <div className='block__info_additional_row'>
                <i>Максимальная температура </i> {max}&deg;
                </div>
        </div>)
    }
    function popupShowHandler() {
        setPopupShow(false)
    }
    function handleDayChange(i, day) {
        setSelectedDay(day + 1)
        changeDay(i)
    }

    return (
        <React.Fragment>
            <h2 onClick={() => setPopupShow(true)}>{cityData.cityName}&nbsp;&#9776;</h2>
            <PopupData
                show={popupShow}
                country={cityData.country}
                lat={cityData.lat}
                lon={cityData.lon}
                timezone={cityData.timezone}
                sunrise={cityData.handledSunrise}
                sunset={cityData.handledSunset}
                population={cityData.population}
                onclick={popupShowHandler}
            />
            <div className='weather__days_select'>
                {week.length > 0
                    ? week.map((day, index) => (
                        index === selectedDay - 1
                            ? <div key={index} className='day__name day__name_selected' onClick={() => handleDayChange(day.dayNumber)}> {day.dayName} </div>
                            : <div key={index} className='day__name' onClick={() => handleDayChange(day.dayNumber, index)}> {day.dayName} </div>
                    )) : false}
            </div>
            {dayData && cityInfoRender()}
            {dayData.length
                ? <Slider data={dayData} sunrise={cityData.handledSunrise} sunset={cityData.handledSunset} />
                : <h3>Loading . . . </h3>}
        </React.Fragment>
    )
}
