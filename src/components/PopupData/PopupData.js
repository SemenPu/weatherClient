import { useEffect, useState } from 'react'
import { YMaps, Map, Placemark } from 'react-yandex-maps'

import styles from './PopupData.module.sass'

export const PopupData = ({ country, lat, lon, timezone, show, sunrise, sunset, onclick, population }) => {

    const [utc, setUtc] = useState('')

    useEffect(() => {
        if (!utc) {
            if (timezone) {
                const utc = timezone > 1 ? `+${timezone / 3600}` : timezone / 3600
                setUtc(utc)
            }
        }
    }, [utc, timezone])
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
                    <span>{sunrise}</span>
                </div>
                <div className={styles.popup__addInfo}>
                    <span>Закат:</span>
                    <span>{sunset}</span>
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
