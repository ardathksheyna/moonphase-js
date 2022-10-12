import {toHoursMinutesString, toLocaleTimeString} from "./helpers/functions"

export const SunData = (sunTimes) => {
    return (
        <ul className="data-table sun-data js-sun-data">
            <li><strong className="label">Sunrise</strong><span data-name="sunrise" className="value">{toLocaleTimeString(sunTimes.sunrise)}</span></li>
            <li><strong className="label">Sunset</strong><span data-name="sunset" className="value">{toLocaleTimeString(sunTimes.sunset)}</span></li>
            <li><strong className="label">Civil Twilight Starts</strong>
                <span data-name="civil_twilight_begin" className="value">{toLocaleTimeString(sunTimes.civil_twilight_begin)}</span></li>
            <li><strong className="label">Civil Twilight Ends</strong>
                <span data-name="civil_twilight_end" className="value">{toLocaleTimeString(sunTimes.civil_twilight_end)}</span></li>
            <li><strong className="label">Solar Noon</strong><span data-name="solar_noon" className="value">{toLocaleTimeString(sunTimes.solar_noon)}</span></li>
            <li><strong className="label">Day length</strong><span data-name="day_length" className="value">{toHoursMinutesString(sunTimes.day_length)}</span></li>
        </ul>
    )
}

export const Loader = () => {
    return (
        <>
            <h2>Loading...</h2>
        </>
    )
}