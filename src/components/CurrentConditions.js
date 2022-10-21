import {getCacheData, setCacheData, WEATHER_DATA} from "./helpers/cache"

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
    console.log(props)
    return (
    <ul className="data-table">
        <li>{props.name}</li>
    </ul>
    )
}