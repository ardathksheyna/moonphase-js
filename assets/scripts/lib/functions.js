function toDegrees(number) {

    var deg = parseInt(number),
        min = Math.floor((number - deg) * 60),
        sec = Math.round((min - parseInt(min)) * 60),
        degString = deg.toString() + "&deg; " + min.toString() + "&prime; " + sec.toString() + "&Prime; ";

    return degString;
}

function toDaysHours(number) {

    var day = parseInt(number),
        hour = ((number - day) * 24).toFixed(0),
        dayString = day.toString() + "d " + hour + "h";

    return dayString;
}

function between(value, before, after) {
    return (value > before && value < after);
}

function is_before(value, before) {
    return value < before;
}

function is_after(value, after) {
    return value > after;
}