import {useEffect} from "react"
import {getPosition, getSunRiseSet} from "./helpers/sundata"

export function DataTableSun() {

    useEffect(() => {
        const position = getPosition().then()
    })

    return (
        <ul className="data-table sun-data js-sun-data">
            <li><strong className="label">Sunrise</strong><span data-name="sunrise" className="value"></span></li>
            <li><strong className="label">Sunset</strong><span data-name="sunset" className="value"></span></li>
            <li><strong className="label">Civil Twilight Starts</strong>
                <span data-name="civil_twilight_begin" className="value"></span></li>
            <li><strong className="label">Civil Twilight Ends</strong>
                <span data-name="civil_twilight_end" className="value"></span></li>
            <li><strong className="label">Solar Noon</strong><span data-name="solar_noon" className="value"></span></li>
            <li><strong className="label">Day length</strong><span data-name="day_length" className="value"></span></li>
        </ul>
    )
}