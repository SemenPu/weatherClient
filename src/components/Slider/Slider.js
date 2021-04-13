import { useState, useEffect } from 'react'
import 'weather-icons/css/weather-icons.css'
import 'weather-icons/css/weather-icons-wind.min.css'
import styles from './Slider.module.sass'

export const Slider = ({ data }) => {
    const [items, setItems] = useState(0) // эл-ты слайдера (ДОМ)
    const [totalCount, setTotalCount] = useState(false) // общее кол-во эл-тов
    const [screenCount, setScreenCount] = useState(false) // кол-во видимых эл-тов, при первой отрисовке
    const [offsetPx, setOffsetPx] = useState(0) // сдвиг в px, offsetPx / itemWidth = offsetCount
    const [offsetCount, setOffsetCount] = useState(0) // сдвиг в эл-тах offsetCount * itemWidth = offsetPx 
    const [slider, setSlider] = useState() // контейнер всех эл-тов (ДОМ)
    const [screenContainer, setScreenContainer] = useState(0) // контейнер видимых эл-тов (ДОМ)
    const [itemWidth, setItemWidth] = useState(0) // ширина эл-та, на нее делаем сдвиг

    useEffect(() => { // при data создаем/обновляем slider
        if (!data) return
        if (!slider) {
            const slider = document.getElementById('weather__slider')
            const screenContainer = document.getElementById('slider_count_anchor')
            const items = document.getElementsByClassName('weather__card')
            setSlider(slider)
            setScreenContainer(screenContainer)
            setItems(items)
            setTotalCount(items.length)
        } else sliderHanlder()
        if (slider) handleSliderOptions()
        // eslint-disable-next-line
    }, [data, slider])

    useEffect(() => {
        if (slider) {
            window.addEventListener('resize', () => resizeHandler(slider))
        }
        return () => window.removeEventListener('resize', () => resizeHandler(slider))
        // eslint-disable-next-line
    }, [slider])

    useEffect(() => {
        const items = document.getElementsByClassName('weather__card')
        setItems(items)
        setTotalCount(items.length)
    }, [data])

    function resizeHandler(slider) {
        const width = handleSliderOptions(true)
        const translatePx = Number.parseInt(slider.style.transform.split('(')[1])
        const newOffset = Math.round(translatePx / width) * width
        slider.style.transform = `translateX(${newOffset}px)`
        setOffsetPx(newOffset)
        setOffsetCount(Math.abs(Math.round(translatePx / width)))
    }
    function handleSliderOptions(re = false) {
        const itemMargin = Number.parseInt(getComputedStyle(items[0]).marginRight)
        const itemWidth = Number.parseInt(getComputedStyle(items[0]).width) + itemMargin * 2
        const screenContainerWidth = Number.parseInt(getComputedStyle(screenContainer).width) // ширина контейнера видимых эл-тов
        const screenCount = Math.round(screenContainerWidth / itemWidth)
        setItemWidth(itemWidth)
        setScreenCount(screenCount)
        if (re) return itemWidth
    }
    function sliderHanlder(direction = '') { // обработчик прокрутки в стороны
        switch (direction) {
            case 'right':
                if ((totalCount - offsetCount - screenCount) > 0) {
                    setOffsetPx(offset => {
                        offset = offset - itemWidth
                        slider.style.transform = `translateX(${offset}px)`
                        return offset
                    })
                    setOffsetCount(offsetCount + 1)
                }
                break
            case 'left':
                if (offsetPx + itemWidth <= 0) {
                    setOffsetPx(offset => {
                        offset = offset + itemWidth
                        slider.style.transform = `translateX(${offset}px)`
                        return offset
                    })
                    setOffsetCount(offsetCount - 1)
                }
                break
            default:
                setOffsetPx(0)
                setOffsetCount(0)
                slider.style.transform = 'translateX(0px)'
                break
        }
    }

    return (
        <div className={styles.container__slider}>
            {/* <div className={styles.test_abs}>
                Offset:{offsetPx} px, offset count:{offsetCount}, card width:{itemWidth} px, total count:{totalCount}
            </div> */}
            <div className={styles.subcontainer__slider}>
                <div className={`${styles.slider__arrow} ${styles.slider__arrow_left}`} onClick={() => sliderHanlder('left')} />
                <div className={styles.weather__slider__container} id='slider_count_anchor'>
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
                                    <div className={styles.weather__card_row} >
                                        <div className={styles.card__row_first}>Ощущается: </div>
                                        <div className={styles.card__row_second}>{day.temp.feel}&deg;</div>
                                    </div>
                                    <div className={styles.weather__card_row}>
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
