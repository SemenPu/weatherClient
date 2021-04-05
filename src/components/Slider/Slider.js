import { useState, useEffect } from 'react'
import 'weather-icons/css/weather-icons.css'
import 'weather-icons/css/weather-icons-wind.min.css'
import styles from './Slider.module.sass'

export const Slider = ({ data }) => {
    const [elemWidth, setElemWidth] = useState(0) // величина сдвига = calc( width + margin) - const
    const [count, setCount] = useState(1) // общее количество элементов слайдера
    const [offset, setOffset] = useState(0) // величина сдвига в пикселях(изменяемая)
    const [slider, setSlider] = useState(false) // ДОМ-элемент слайдера

    useEffect(() => {
        setTimeout(() => {
            createSliderParams()
            if (slider) sliderHanlder('none')
        }, 30)
        // eslint-disable-next-line
    }, [data])

    useEffect(() => {
        if (slider) sliderHanlder('none')
        // eslint-disable-next-line
    }, [slider])

    function createSliderParams() {  // обработчик величины (px) прокрутки
        const elems = document.getElementsByClassName('weather__card')
        if (elems.length < 1) return
        const width = elems[0].offsetWidth
        const marg = Number.parseInt(getComputedStyle(elems[0]).marginRight)
        setElemWidth(Number(width) + marg * 2)
        setCount(elems.length)
        setSlider(document.getElementById('weather__slider'))
    }

    function sliderHanlder(direction) { // обработчик прокрутки в стороны
        if (direction === 'right') {
            const offsetEnd = -elemWidth * (count - 4) // count * 4, где 4 это число отображаемых эл-тов на странице, для корректного сдвига
            if (offset <= offsetEnd) return
            setOffset(offset => {
                const computed = offset - elemWidth
                slider.style.transform = `translateX(${computed}px)`
                return computed
            })
        }
        if (direction === 'left') {
            setOffset(offset => {
                const computed = offset + elemWidth
                if (computed > 0) return 0
                slider.style.transform = `translateX(${computed}px)`
                return computed
            })
        }
        if (direction === 'none') {
            setOffset(0)
            slider.style.transform = 'translateX(0)'
        }
    }

    return (
        <div className={styles.contaner__slider}>
            <div className={styles.subcontainer__slider}>
                <div className={`${styles.slider__arrow} ${styles.slider__arrow_left}`} onClick={() => sliderHanlder('left')} />
                <div className={styles.weather__slider__container}>
                    <div className={styles.slider} id='weather__slider'>
                        {data ?
                            data.map((day, index) => (
                                <div key={index} className={`${styles.slider__weather__card} weather__card`}>
                                    <div className={styles.weather__card_time}>
                                        <i className={day.weatherClassName} /> {day.hour}:00 </div>
                                    <div className={`${styles.weather__card_row} ${styles.weather__card_real_temp}`}>
                                        <div className={styles.card__row_first}>Температура: </div>
                                        <div className={styles.card__row_second}>{day.temp.real}&deg;</div>
                                    </div>
                                    <div className={`${styles.weather__card_row} ${styles.weather__card_feel_temp}`}>
                                        <div className={styles.card__row_first}>Ощущается: </div>
                                        <div className={styles.card__row_second}>{day.temp.feel}&deg;</div>
                                    </div>
                                    <div className={`${styles.weather__card_row} ${styles.weather__card_wind}`}>
                                        <div className={styles.card__row_first}>
                                            Ветер:</div>
                                        <div className={styles.card__row_second}><i className={`wi wi-wind towards-${day.windDirection}-deg`} title={day.directionTitle} />&nbsp;
                                        {day.wind} м/с</div>
                                    </div>
                                </div>
                            ))
                            : false}
                    </div>
                </div>
                <div className={`${styles.slider__arrow} ${styles.slider__arrow_right}`} onClick={() => sliderHanlder('right')} />
            </div>
        </div>
    )
}
