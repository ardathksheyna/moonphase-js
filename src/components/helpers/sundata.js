import moment from "moment/moment"
import {currentTime} from "./moonfx"
import { getCacheData, setCacheData, SUN_DATA } from "./cache"

const END_POINT = 'https://api.sunrise-sunset.org/json'

export interface SunDataProps {
    sunrise: string,
    sunset: string,
    civil_twilight_end: string,
    civil_twilight_begin: string
}

export async function getSunRiseSet(position) {
    const {latitude, longitude} = position.coords
    const date = moment(currentTime).format('YYYY-MM-DD')
    const params = new URLSearchParams({
        lat: latitude,
        lng: longitude,
        date: date,
        formatted: 0
    })

    let cached_data = getCacheData(SUN_DATA)
    if (cached_data) {
        return JSON.parse(cached_data)
    }

    const data = await fetch(END_POINT + '?' + params, {
        method: 'GET'
    }).then((data) => {
        return data.json();
    })

    if (data.status !== 'OK') {
        // then do some shit
        return {}
    }

    // set cache
    setCacheData(SUN_DATA, JSON.stringify(data.results), ((Date.now() / 1000) + 43200));

    return data.results;
}

export async function getPosition(options?: PromiseOptions): Promise {
    return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}

export function timeOfDay(sunData: SunDataProps) {
    let sunrise = new Date(sunData.sunrise).getTime()
    let sunset = new Date(sunData.sunset).getTime()
    let twilight_end = new Date(sunData.civil_twilight_end).getTime()
    let twilight_begin = new Date(sunData.civil_twilight_begin).getTime()
    let now = Date.now()

    if (now > sunrise && now < sunset) {
        // console.log('it is daytime')
        return 'bg--daytime'
    } else if (now > sunset && now < twilight_end) {
        // console.log('it is now after sunset but still light')
        return 'bg--evening'
    } else if (now > twilight_end) {
        // console.log('it is now night')
        return 'bg--night'
    } else if (now > twilight_begin) {
        // console.log('it is predawn')
        return 'bg--morning'
    }
}
