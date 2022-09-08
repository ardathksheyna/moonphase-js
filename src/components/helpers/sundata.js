import moment from "moment/moment"
import {currentTime} from "./moonfx"

const END_POINT = 'https://api.sunrise-sunset.org/json'
const END_POINT_TEST = 'assets/test/sunrise-sunset.json'
let data = {}

export function getSunRiseSet(position) {

    const {latitude, longitude} = position.coords
    const date                  = moment(currentTime).format('YYYY-MM-DD')
    console.log(latitude, longitude, date)

    // let coords = $.param({
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude,
    //     date: moment(MoonPhase.currentTime).format('YYYY-MM-DD'),
    //     formatted: 0
    // });
    //
    // let endPoint = this.apiEndPoint;
    // if (debug) {
    //     endPoint = this.apiEndPointTest;
    // }
    //
    // let $body = $('body');
    //
    // $.ajax({
    //     url: endPoint,
    //     jsonp: true,
    //     data: coords,
    //     success: function (data) {
    //         let sunrise = new Date(data.results.sunrise).getTime();
    //         let sunset = new Date(data.results.sunset).getTime();
    //         let twilight_end = new Date(data.results.civil_twilight_end).getTime();
    //         let twilight_begin = new Date(data.results.civil_twilight_begin).getTime();
    //
    //         let now = MoonPhase.currentTime;
    //
    //         if (now > sunrise && now < sunset) {
    //             console.log('it is daytime');
    //             $body.addClass('bg--daytime');
    //         } else if (now > sunset && now < twilight_end) {
    //             console.log('it is now after sunset but still light');
    //             $body
    //                 .removeClass()
    //                 .addClass('bg--evening');
    //         } else if (now > twilight_end) {
    //             console.log('it is now night');
    //             $body
    //                 .removeClass()
    //                 .addClass('bg--night');
    //         } else if (now > twilight_begin) {
    //             console.log('it is predawn');
    //             $body
    //                 .removeClass()
    //                 .addClass('bg--morning');
    //         }
    //
    //         // add sun data
    //         $('.js-sun-data .value').each(function(){
    //             let name = $(this).data('name');
    //             if (name !== 'day_length') {
    //                 $(this).html(moment(data.results[name]).format('LT'));
    //             } else {
    //                 $(this).html(toHoursMinutesString(data.results[name]))
    //             }
    //         });
    //     },
    //     error: function (data) {
    //         console.log(data);
    //     }
    // });

}

export function getPosition(options?: PromiseOptions): Promise {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            getSunRiseSet(position)
        })
    })
}