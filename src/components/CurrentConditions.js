import {getCacheData, setCacheData, WEATHER_DATA} from "./helpers/cache"
import {getHumanReadableDirection} from "./helpers/weatherdata"
import {isNumber} from "use-http/dist/cjs/utils"

interface WeatherProps {
    id: number,
    main: string,
    description: string,
    icon: string,  // not used
}

interface MainProps {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number,
}

interface WindProps {
    speed: number,
    deg: number, // direction in degrees
}

interface CurrentConditionsProps {
    weather: Array<WeatherProps>,
    base: string,
    main: MainProps,
    wind: WindProps,
    name: string, // location name
}

export function CurrentConditions(props: CurrentConditionsProps) {
    const data = props.props
    if (Object.keys(data).length === 0) {
        return(<></>)
    }

    return (
    <ul className="data-table weather-data">
        <li>Location: {data.name}</li>
        <li>Current Conditions:
            <ul>
                <li>Current Temp: {Math.round(data.main.temp)}&deg;</li>
                <li>Feels like: {Math.round(data.main.feels_like)}&deg;</li>
                <li>Pressure (inHg) {(Math.round(data.main.pressure) / 33.864).toFixed(2)} in</li>
                <li>Humidity: {data.main.humidity}%</li>
                <li>Wind:
                    <ul>
                        <li>{getHumanReadableDirection(data.wind.deg)} @ {Math.round(data.wind.speed)}mph </li>
                        {typeof data.wind.gust !== 'undefined' &&
                        <li>Gusting to {Math.round(data.wind.gust)}mph</li>
                        }
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
    )
}