const monthNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
const dayNames = ['', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const directions = ['Северный', 'Северный Северо-Восточный', 'Северо-Восточный', 'Восточный Северо-Восточный', 'Восточный', 'Восточный Юго-Восточный', 'Юго-Восточный', 'Южный Юго-Восточный', 'Южный', 'Южный Юго-Западный', 'Юго-Западный', 'Западный Юго-Западный', 'Западный', 'Западный Северо-Западный', 'Северо-Западный', 'Северный Северо-Западный']
// делим градусы на 22.5 получаем нужный порядковый номер(-1)
export async function getData(url) {
    try {
        const response = await fetch(url)
        if (response.status !== 200) throw new Error(response.statusText)
        const data = await response.json()
        return data
    } catch (e) {
        return e
    }
}

export function dataObjectConstructor(data, sunrise, sunset) {
    const handledData = {}
    let currentDay = getDayFromDate(data[0].dt)
    handledData[`day_${currentDay}`] = []
    let k = 1
    for (let item of data) {
        const calcDay = getDayFromDate(item.dt)
        if (calcDay !== currentDay) {
            currentDay = calcDay
            k++
            if (k < 6) handledData[`day_${currentDay}`] = []
        }
        if (k < 6) {
            const handledItem = {
                hour: getHourFromDate(item.dt),
                day: getDayFromDate(item.dt),
                date: getDateFromDate(item.dt),
                month: getMonthFromDate(item.dt),
                dayName: dayNames[getDayFromDate(item.dt)],
                monthName: monthNames[getMonthFromDate(item.dt)],
                temp: {
                    real: Math.round(item.main.temp),
                    feel: Math.round(item.main.feels_like),
                    min: Math.round(item.main.temp_min),
                    max: Math.round(item.main.temp_max)
                },
                weather: item.weather[0].description,
                weatherId: item.weather[0].id,
                weatherClassName: createWeatherClassName(item, sunrise, sunset),
                wind: item.wind.speed,
                windDirection: item.wind.deg,
                directionTitle: createWindDirection(item)
            }
            handledData[`day_${currentDay}`].push(handledItem)
        }
    }
    return handledData
}

export function cityObjectConstructor(data) {
    const handledSunrise = new Date(data.city.sunrise * 1000).toLocaleTimeString()
    const handledSunset = new Date(data.city.sunset * 1000).toLocaleTimeString()

    const cityData = {
        cityName: data.city.name,
        id: data.city.id,
        country: data.city.country,
        lat: data.city.coord.lat,
        lon: data.city.coord.lon,
        handledSunrise,
        handledSunset,
        timezone: data.city.timezone,
        population: data.city.population
    }
    return cityData
}

export function createCurrentWeek(data) {
    const currentWeek = []
    const weekNumbs = Object.keys(data)
    weekNumbs.forEach(day => {
        const numb = day[day.length - 1]
        const k = Number(numb)
        currentWeek.push({ dayName: dayNames[k], dayNumber: Number(numb) })
    })
    return currentWeek
}

function getDayFromDate(date) {
    return Number(new Date(date * 1000).getDay()) === 0 ? 7 : Number(new Date(date * 1000).getDay())
}
function getDateFromDate(date) {
    return Number(new Date(date * 1000).getDate())
}
function getMonthFromDate(date) {
    return Number(new Date(date * 1000).getMonth())
}
function getHourFromDate(date) {
    return Number(new Date(date * 1000).getHours())
}
function createWeatherClassName(day, rise, fall) {
    const sunrise = getHourFromDate(rise)
    const sunset = getHourFromDate(fall)
    let dayLight = true
    if (getHourFromDate(day.dt) > sunset || getHourFromDate(day.dt) < sunrise) dayLight = false
    const out = weatherIconHandler(day.weather[0].id, dayLight)
    return out

}
function createWindDirection(day) {
    let directionTitle = Math.floor(day.wind.deg / 22.5)
    const out = directionTitle = directions[directionTitle]
    return out
}
function weatherIconHandler(id, day) {
    if (id < 203) return day ? 'wi wi-day-thunderstorm' : 'wi wi-night-alt-lightning'
    if (id < 222) return day ? 'wi wi-day-lightning' : 'wi wi-night-alt-lightning'
    if (id < 233) return day ? 'wi wi-day-thunderstorm' : 'wi wi-night-alt-thunderstorm'
    if (id <= 301) return day ? 'wi wi-day-sprinkle' : 'wi wi-night-alt-sprinkle'
    if (id < 315) return day ? 'wi wi-day-rain' : 'wi wi-night-alt-rain'
    if (id < 501) return day ? 'wi wi-day-sprinkle' : 'wi wi-night-alt-sprinkle'
    if (id < 505) return day ? 'wi wi-day-rain' : 'wi wi-night-alt-rain'
    if (id === 511) return day ? 'wi wi-day-rain-mix' : 'wi wi-night-alt-rain-mix'
    if (id < 523) return day ? 'wi wi-day-showers' : 'wi wi-night-alt-showers'
    if (id === 531) return day ? 'wi wi-day-storm-showers' : 'wi wi-night-alt-storm-showers'
    if (id === 600) return day ? 'wi wi-day-snow' : 'wi wi-night-alt-snow'
    if (id < 602) return day ? 'wi wi-day-sleet' : 'wi wi-night-alt-sleet'
    if (id === 602) return day ? 'wi wi-day-snow' : 'wi wi-night-alt-snow'
    if (id < 621) return day ? 'wi wi-day-rain-mix' : 'wi wi-night-alt-rain-mix'
    if (id < 623) return day ? 'wi wi-day-snow' : 'wi wi-night-alt-snow'
    if (id === 701) return day ? 'wi wi-day-showers' : 'wi wi-night-alt-showers'
    if (id === 711) return 'wi wi-smoke'
    if (id === 721) return 'wi wi-day-haze'
    if (id === 731) return 'wi wi-dust'
    if (id === 741) return day ? 'wi wi-day-fog' : 'wi wi-night-fog'
    if (id < 763) return 'wi wi-dust'
    if (id === 781) return 'wi wi-tornado'
    if (id === 800) return day ? 'wi wi-day-sunny' : 'wi wi-night-clear'
    if (id < 804) return day ? 'wi wi-day-cloudy-gusts' : 'wi wi-night-alt-cloudy-gusts'
    if (id === 804) return day ? 'wi wi-day-sunny-overcast' : 'wi wi-night-alt-cloudy'
    if (id === 900) return 'wi wi-tornado'
    if (id === 902) return 'wi wi-hurricane'
    if (id === 903) return 'wi wi-snowflake-cold'
    if (id === 904) return 'wi wi-hot'
    if (id === 906) return day ? 'wi wi-day-hail' : 'wi wi-night-alt-hail'
    if (id === 957) return 'wi wi-strong-wind'
}
