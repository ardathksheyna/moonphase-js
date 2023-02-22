import {getCacheData, setCacheData, WEATHER_DATA} from "./cache"
import {WeatherPropsArray} from "../CurrentConditions"
import type {WeatherProps} from "../CurrentConditions"

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
        return data.json()
    })

    // set cache
    setCacheData(WEATHER_DATA, JSON.stringify(data), ((Date.now() / 1000) + 3600))

    return data
}

export function getHumanReadableDirection(deg) {
    switch (true) {
        case deg < 359 && deg > 336.5:
            return 'N'
        case deg < 336.5 && deg > 314:
            return 'NNW'
        case deg < 314 && deg > 291.5:
            return 'WNW'
        case deg < 291.5 && deg > 246.5:
            return 'W'
        case deg < 246.5 && deg > 224:
            return 'WSW'
        case deg < 224 && deg > 201.5:
            return 'SSW'
        case deg < 201.5 && deg > 156.5:
            return 'S'
        case deg < 156.5 && deg > 134:
            return 'SSE'
        case deg < 134 && deg > 111.5:
            return 'ESE'
        case deg < 111.5 && deg > 66.5:
            return 'E'
        case deg < 66.5 && deg > 44:
            return 'ENE'
        case deg < 44 && deg > 21.5:
            return 'NNE'
        case deg < 21.5 && deg > 0:
            return 'N'
        default:
            return ''
    }
}

export function getCurrentConditionsDisplay(weather: WeatherPropsArray) {
    let currentConditions = []
    currentConditions.push( weather.map((weather: WeatherProps) => {
        return weather.description.trim().replace(/\s+/g, '-').toLowerCase()
    }));

    return currentConditions.join(' ').trim()
}