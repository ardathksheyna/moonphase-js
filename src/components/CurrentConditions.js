import {getCacheData, setCacheData, WEATHER_DATA} from "./helpers/cache"
import {getHumanReadableDirection} from "./helpers/weatherdata"
import {isNumber} from "use-http/dist/cjs/utils"

export interface WeatherProps {
    id: number,
    main: string,
    description: string,
    icon: string,  // not used
}

export interface WeatherPropsArray extends Array<WeatherProps> {}

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
        <li className="table-caption"><h3>{data.name}</h3></li>
        <li className="table-caption">Current Conditions</li>
        <li>
            <ul className="value data-table sub">
                <li><strong className="label">Current Temp</strong> <span className="value">{Math.round(data.main.temp)} &deg;</span></li>
                <li><strong className="label">Feels like</strong> <span
                    className="value">{Math.round(data.main.feels_like)} &deg;</span></li>
                <li><strong className="label">Pressure(inHg)</strong> <span
                    className="value">{(Math.round(data.main.pressure) / 33.864).toFixed(2)}in</span></li>
                <li><strong className="label">Humidity</strong> <span className="value">{data.main.humidity}%</span></li>
                <li><strong className="label">Wind</strong>
                    <ul className="value data-table sub">
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