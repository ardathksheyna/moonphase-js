export function toDegrees(number) {

    let  deg = parseInt(number),
        min = Math.floor((number - deg) * 60),
        sec = Math.round((min - parseInt(min)) * 60),
        degString = deg.toString() + "&deg; " + min.toString() + "&prime; " + sec.toString() + "&Prime; ";

    return degString;
}

export function toDaysHours(number) {

    let  day = parseInt(number),
        hour = ((number - day) * 24).toFixed(0),
        dayString = day.toString() + "d " + hour + "h";

    return dayString;
}

/**
 * Convert to XXh XXm format
 * @param {number} seconds
 * @returns {string}
 */
export function toHoursMinutesString(seconds) {
    let daylength_in_hours = seconds / 3600;
    let hours = parseInt(daylength_in_hours, 10);
    let minutes = parseInt(Math.round(( daylength_in_hours - hours) * 60), 10);

    return hours + 'h ' + minutes + 'm';
}

export function toLocaleTimeString(date: string) {
    return new Date(date).toLocaleTimeString()
}

export function between(value, before, after) {
    return (value > before && value < after);
}

export function is_before(value, before) {
    return value < before;
}

export function is_after(value, after) {
    return value > after;
}
