import {getMoonData} from './helpers/moonfx'
import {getPhaseNames} from "./helpers/moonphases"

export function DataTableMoon() {

    const {distance, illumination, julianDate, phaseAngle, synodicAge} = getMoonData()
    const parser = new DOMParser()

    return (
        <ul className="data-table moon-data js-moon-data">
            <li><strong className="label">Current Phase</strong> <span data-name="phaseName" className="value">{getPhaseNames(synodicAge)}</span>
            </li>
            <li><strong className="label">Julian Date</strong> <span data-name="julianDate" className="value">{julianDate}</span>
            </li>
            <li><strong className="label">Moon's Age</strong> <span data-name="synodicAge" className="value">{synodicAge}</span>
            </li>
            <li><strong className="label">Phase Angle</strong> <span data-name="phaseAngle" className="value">{parser.parseFromString(phaseAngle, 'text/html').body.textContent}</span>
            </li>
            <li><strong className="label">Percent Illuminated</strong>
                <span data-name="illumination" className="value">{illumination}</span>
            </li>
            <li><strong className="label">Distance</strong> <span data-name="distance" className="value">{distance}</span></li>
        </ul>
    )
}