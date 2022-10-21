import {getCacheData, setCacheData, SUN_DATA, WEATHER_DATA} from "./cache"

const END_POINT = 'https://api.openweathermap.org/data/2.5/weather'

export async function getWeatherData(location) {

    let cached_data = getCacheData(WEATHER_DATA)
    if (cached_data) {
        return JSON.parse(cached_data)
    }

    const {latitude, longitude} = location.coords
    const params = new URLSearchParams({
        lat: latitude,
        lon: longitude,
        units: 'imperial',
        appid: 'afbb6049b5ba6d3c9ce20a0d66103cf2'
    })

    const data = await fetch(END_POINT + '?' + params, {
        method: 'GET'
    }).then((data) => {
        return data.json();
    })

    // set cache
    setCacheData(WEATHER_DATA, JSON.stringify(data));

    return data
}

export function getCurrentWeather(data) {

}