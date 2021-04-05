import { useEffect, useState } from 'react'
import { YMaps, Map, Placemark } from 'react-yandex-maps'

import styles from './PopupData.module.sass'

export const PopupData = ({ country, lat, lon, timezone, show, sunrise, sunset, onclick, population }) => {

    const [utc, setUtc] = useState('')
    const [sunriseObj, setSunriseObj] = useState('')
    const [sunsetObj, setSunsetObj] = useState('')

    useEffect(() => {
        if (!utc) {
            if (timezone) {
                const utc = timezone > 1 ? `+${timezone / 3600}` : timezone / 3600
                setUtc(utc)
            }
        }
    }, [utc, timezone])

    useEffect(() => {
        if (!sunrise) return
        if (sunriseObj) return
        const rawSunrise = new Date(sunrise)
        const sunriseD = `${rawSunrise.getHours()}:${rawSunrise.getMinutes()}`
        setSunriseObj(sunriseD)
    }, [sunrise, sunriseObj])

    useEffect(() => {
        if (!sunset) return
        if (sunsetObj) return
        const rawSunset = new Date(sunset)
        const sunsetD = `${rawSunset.getHours()}:${rawSunset.getMinutes()}`
        setSunsetObj(sunsetD)
    }, [sunset, sunsetObj])

    return (
        show &&
        <div className={styles.popup__block}>
            <div onClick={onclick} className={styles.popup__block_close} />
            <div className={styles.citiData__container}>
                <div className={styles.popup__addInfo}>
                    <span>Код региона:</span>
                    <span>{country}</span>
                </div>
                <div className={styles.popup__addInfo}>
                    <span>Часовой пояс (UTC):</span>
                    <span>{utc}</span>
                </div>
                <div className={styles.popup__addInfo}>
                    <span>Рассвет:</span>
                    <span>{sunriseObj}</span>
                </div>
                <div className={styles.popup__addInfo}>
                    <span>Закат:</span>
                    <span>{sunsetObj}</span>
                </div>
                {/* <div className={styles.popup__addInfo}>
                        <span>{lat}</span>
                        <span>Some additional info</span>
                </div>
                <div className={styles.popup__addInfo}>
                    <span>{lon}</span>
                    <span>Some additional info</span>
                </div> 
                <div className={styles.popup__addInfo}>
                    <span>Население:</span>
                    <span>{population.toLocaleString()}</span>
                </div>*/}
            </div>
            <div className={styles.map__container}>
                <YMaps>
                    <Map
                        defaultState={{
                            center: [lat, lon],
                            zoom: 10, // сделать Zoom от населения
                            controls: { smallMapDefaultSet: true }
                        }}
                        height={200}
                        width={300}
                    >
                        <Placemark
                            geometry={[lat, lon]}
                            options={{
                                preset: 'islands#nightDotIcon',
                            }}
                        />
                    </Map >
                </YMaps>
            </div>
        </div >
    )
}
