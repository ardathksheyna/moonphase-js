import {
    toDegrees,
    toDaysHours
} from './functions'

/**
 * Radius of Earth in miles
 */
const EARTH_RADIUS_MI = 3959

/**
 * Length of one day in seconds
 */
const ONE_DAY = 86400

/**
 * Moon's synodic period
 */
const SYNODIC_PERIOD = 29.530589


/**
 * Value of PI in radians
 */
const PI_RADIANS = Math.PI * 2


/**
 * Current date
 *
 * @type number
 */
export const currentTime = new Date().getTime()


export function getMoonData() {
    return {
        "synodicAge": toDaysHours(getSynodicPhase()),
        "julianDate": getJulianDate().toFixed(4),
        "phaseAngle": toDegrees(getPhaseAngle()),
        "distance": (getDistanceInEarthRadii() * EARTH_RADIUS_MI).toFixed(0).toString() + " mi",
        "illumination": (getIlluminatedRatio() * 100).toFixed(0).toString() + "%"
    }
}

/**
 * Get current Julian Date
 *
 * @returns {Number}
 */
export function getJulianDate(){
    return ((currentTime / 1000) / ONE_DAY) + 2440587.5;
}


/**
 * Get current synodic phase (Moon's age)
 *
 * @returns {Number}
 */
export function getSynodicPhase() {
    let julianDate   = getJulianDate(),
        synodicPhase = _normalize((julianDate - 2451550.1) / SYNODIC_PERIOD)
            * SYNODIC_PERIOD;

    return synodicPhase;
}


/**
 * Get current distance to the moon in Earth Radii
 *
 * @returns {Number}
 */
export function getDistanceInEarthRadii () {
    let distanceInRadians = _normalize((getJulianDate() - 2451562.2) / 27.55454988) * PI_RADIANS,
        synodicPhaseInRadians = getSynodicPhase() * PI_RADIANS,

        distance = 60.4 - 3.3 * Math.cos(distanceInRadians) - 0.6
            * Math.cos(2 * synodicPhaseInRadians - distanceInRadians) - 0.5
            * Math.cos(2 * synodicPhaseInRadians);

    return distance;
}


/**
 * Get Moon's current ecliptic latitude
 * @returns {Number}
 */
export function getEclipticLatitude() {
    let value = _normalize((getJulianDate() - 2451565.2) / 27.212220817),
        eclipticLatitude = 5.1 * Math.sin(value * PI_RADIANS);

    return eclipticLatitude;
}


/**
 * Get Moon's current ecliptic longitude
 * @returns {number}
 */
export function getEclipticLongitude() {
    let synodicPhaseInRadians = getSynodicPhase() * PI_RADIANS,
        distanceInRadians     = _normalize((getJulianDate() - 245162.2) / 27.55454988) * PI_RADIANS,
        value                 = _normalize((getJulianDate() - 2451555.8) / 27.321582241),

        eclipticLongitude = 360 * value + 6.3 + Math.sin(distanceInRadians) + 1.3
            * Math.sin(2 * synodicPhaseInRadians - distanceInRadians) + 1.3
            * 0.7 * Math.sin(2 * synodicPhaseInRadians);

    return eclipticLongitude;
}


/**
 * Get the current phase angle
 *
 * @param {Number} synodicAge
 * @returns {Number}
 */
export function getPhaseAngle(synodicAge) {
    synodicAge = synodicAge ? synodicAge : getSynodicPhase();

    let phaseAngle = synodicAge * (360 / SYNODIC_PERIOD);

    if (phaseAngle > 360) {
        phaseAngle = phaseAngle - 360;
    }

    return phaseAngle;

}



/**
 * Get moon illuminated ratio (in decimals)
 * @param {Number} synodicAge
 * @returns {Number}
 */
export function getIlluminatedRatio(synodicAge) {
    synodicAge = synodicAge ? synodicAge : getSynodicPhase();

    let phaseAngle = getPhaseAngle(synodicAge),
        ratioOfIllumination = 0.5 * (1 - Math.cos(_deg2rad(phaseAngle)));

    return ratioOfIllumination;
}


/**
 * Normalize a number
 *
 * @param {Number} value
 * @returns {Number}
 */
function _normalize(value) {
    value = value - parseInt(value);

    if (value < 0){
        value = value + 1;
    }

    return value;
}


/**
 * Find a number's sign
 *
 * @param {Number} x
 * @returns {int}
 */
function _signum(x) {
    return (Math.abs(x) - x) ? -1 : x > 0;
}


/**
 * Convert degrees to radians
 *
 * @param {Number} x
 * @returns {Number}
 */
function _deg2rad (x) {
    return x * (Math.PI / 180);

}

export function drawMoon(context, {height, width}) {
    let cx     = width / 2
    let cy     = height / 2
    let synodicAge = getSynodicPhase()
    let illuminationRatio = getIlluminatedRatio(synodicAge)
    let phaseAngle = getPhaseAngle(synodicAge)

    context.beginPath();
    context.arc(cx, cy, (height / 2) - 2, 0, 360, false);
    context.fillStyle = '#fff';
    context.fill();
    context.closePath();

    // draw limb
    let points = [[], []];

    for (let a = 0; a < 180; a++) {
        let angle = _deg2rad(a - 90),
            x1 = Math.ceil( Math.cos( angle ) * cx ),
            y1 = Math.ceil( Math.sin( angle ) * cy ),
            moonWidth = x1 * 2,
            x2 = Math.floor(moonWidth * illuminationRatio);

        if ( phaseAngle < 180 ) {
            x1 = cx - x1;
            x2 = x1 + (moonWidth - x2);
        } else { // waning
            x1 = cx + x1;
            x2 = x1 - (moonWidth - x2);
        }

        let y2 = cy + y1,
            p1 = [x1, y2],
            p2 = [x2, y2];

        points[0].push(p1);
        points[1].push(p2);
    }

    let newPoints = points[0].concat(points[1].reverse());
    context.beginPath();
    context.fillStyle = '#000';
    for (let n in newPoints) {
        let p = newPoints[n];
        if (n === 0) {
            context.moveTo(p[0], p[1]);
        } else {
            context.lineTo(p[0], p[1]);
        }
    }
    context.fill();
    context.closePath();
}

export function drawFavicon() {

    let link = document.createElement('link');
    let canvas = document.getElementById('currentphase');

    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL(link.type);
    link.id = "favicon";

    document.getElementsByTagName('head')[0].appendChild(link);
}