

/* global.js */
(function($, MoonFx){

    // DOM ready
    $(function() {
        MoonPhase.DrawMoon.init();
        MoonPhase.Navigation.init();
        MoonPhase.DrawFavicon.init();
        MoonPhase.LoadData.init();
        MoonPhase.SunriseSunset.init();
    });

    let debug = true;

    let MoonPhase = {};

    MoonPhase.moonFx = MoonFx;
    MoonPhase.currentTime = new Date().getTime();

    MoonPhase.PhaseNames = {
        /**
         * New Moon
         */
        AGE_NEW_MOON: 0,

        /**
         * First Quarter Moon
         */
        AGE_FIRST_QUARTER_MOON: 7,

        /**
         * Full Moon
         */
        AGE_FULL_MOON: 14,

        /**
         * Last Quarter Moon
         */
        AGE_LAST_QUARTER_MOON: 21,

        NEW_MOON        : "NewMoon",
        WAXING_CRESCENT : "WaxingCrescent",
        FIRST_QUARTER   : "FirstQuarter",
        WAXING_GIBBOUS  : "WaxingGibbous",
        FULL_MOON       : "FullMoon",
        WANING_GIBBOUS  : "WaningGibbous",
        LAST_QUARTER    : "LastQuarter",
        WANING_CRESCENT : "WaningCrescent",

        getPhaseName: function(synodicAge) {
            let phaseName = '';

            if (synodicAge >= this.AGE_NEW_MOON && synodicAge < 1) {
                // New Moon
                phaseName = this.NEW_MOON;
            } else if (synodicAge >= 1 && synodicAge < this.AGE_FIRST_QUARTER_MOON) {
                // Waxing Crescent
                phaseName = this.WAXING_CRESCENT;
            } else if (synodicAge >= this.AGE_FIRST_QUARTER_MOON && synodicAge < (this.AGE_FIRST_QUARTER_MOON + 1)) {
                // First Quarter Moon
                phaseName = this.FIRST_QUARTER;
            } else if (synodicAge > (this.AGE_FIRST_QUARTER_MOON + 1) && synodicAge < this.AGE_FULL_MOON) {
                // Waxing Gibbous
                phaseName = this.WAXING_GIBBOUS;
            } else if (synodicAge >= this.AGE_FULL_MOON && synodicAge < (this.AGE_FULL_MOON + 1)) {
                // Full Moon
                phaseName = this.FULL_MOON;
            } else if (synodicAge >= (this.AGE_FULL_MOON + 1) && synodicAge < this.AGE_LAST_QUARTER_MOON) {
                // Waning Gibbous
                phaseName = this.WANING_GIBBOUS;
            } else if (synodicAge >= this.AGE_LAST_QUARTER_MOON && synodicAge < (this.AGE_LAST_QUARTER_MOON + 1)) {
                // Last Quarter Moon
                phaseName = this.LAST_QUARTER;
            } else {
                // Waning Crescent
                phaseName = this.WANING_CRESCENT;
            }

            return phaseName;
        }

    };

    MoonPhase.DrawMoon = {
        canvas  : null,
        context : null,
        moonFx  : null,

        init: function() {
            this.canvas  = document.getElementById('currentphase');
            this.context = this.canvas.getContext('2d');
            this.moonFx  = MoonPhase.moonFx;

            this.drawMoon();
        },

        drawMoon : function() {
            let ctx = this.context,
                height = this.canvas.getAttribute('height'),
                width  = this.canvas.getAttribute('width'),
                cx     = width / 2,
                cy     = height / 2,
                illuminationRatio = this.moonFx.getIlluminatedRatio(),
                phaseAngle = this.moonFx.getPhaseAngle();

            ctx.beginPath();
            ctx.arc(cx, cy, (height / 2) - 2, 0, 360, false);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.closePath();

            // draw limb
            let points = [[], []];

            for (let a = 0; a < 180; a++) {
                let angle = this.moonFx._deg2rad(a - 90),
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
            ctx.beginPath();
            ctx.fillStyle = '#000';
            for (let n in newPoints) {
                let p = newPoints[n];
                if (n === 0) {
                    ctx.moveTo(p[0], p[1]);
                } else {
                    ctx.lineTo(p[0], p[1]);
                }
            }
            ctx.fill();
            ctx.closePath();
        },

        changeDate : function(date) {
            this.moonFx.setDate(date);
            this.drawMoon();
        }
    };

    MoonPhase.LoadData = {
        init : function() {
            let moonData = MoonPhase.moonFx.getMoonData();

            moonData['phaseName'] = MoonPhase.PhaseNames.getPhaseName(MoonPhase.moonFx.getSynodicPhase());

            $('.js-moon-data .value').each(function(){
                let name = $(this).data('name');
                $(this).html(moonData[name]);
            });
        }
    };

    MoonPhase.Navigation = {
        init : function() {
            $('.js-current-date-value').text(function(){
                let dateObj = new Date();

                return dateObj.toLocaleDateString() + " @ " + dateObj.toLocaleTimeString();
            });


            $('.js-date-nav').on('click', function(e){
                e.preventDefault();

                let action = $(this).data('name'),
                    dateObj = new Date();

                if (action === 'prev') {
                    MoonPhase.currentTime = MoonPhase.currentTime - 86400000;
                } else if (action === 'next') {
                    MoonPhase.currentTime = MoonPhase.currentTime + 86400000;
                } else {
                    MoonPhase.currentTime = new Date().getTime();
                }

                dateObj.setTime(MoonPhase.currentTime);

                MoonPhase.moonFx.setDate(MoonPhase.currentTime);
                $('.js-date-value').text(dateObj.toLocaleDateString() + " @ " + dateObj.toLocaleTimeString());

                MoonPhase.DrawMoon.drawMoon();
                MoonPhase.DrawFavicon.init();
                MoonPhase.LoadData.init();
            }).trigger('click');
        }
    };

    MoonPhase.DrawFavicon = {
        init : function() {
            $('#favicon').remove();

            let link = document.createElement('link'),
                canvas = document.getElementById('currentphase');

            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = canvas.toDataURL("image/x-icon");
            link.id = "favicon";
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    };

    MoonPhase.SunriseSunset = {
        apiEndPoint: 'https://api.sunrise-sunset.org/json',
        apiEndPointTest: 'assets/test/sunrise-sunset.json',
        data: {},
        init : function () {
            let self = this;
            navigator.geolocation.getCurrentPosition(function(position) {
                self.getSunRiseSet(position);
            });
        },

        getSunRiseSet : function (position) {
            let coords = $.param({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                date: moment(MoonPhase.currentTime).format('YYYY-MM-DD'),
                formatted: 0
            });

            let endPoint = this.apiEndPoint;
            if (debug) {
                endPoint = this.apiEndPointTest;
            }

            let $body = $('body');

            $.ajax({
                url: endPoint,
                jsonp: true,
                data: coords,
                success: function (data) {
                    let sunrise = new Date(data.results.sunrise).getTime();
                    let sunset = new Date(data.results.sunset).getTime();
                    let twilight_end = new Date(data.results.civil_twilight_end).getTime();
                    let twilight_begin = new Date(data.results.civil_twilight_begin).getTime();

                    let now = MoonPhase.currentTime;

                    if (now > sunrise && now < sunset) {
                        console.log('it is daytime');
                        $body.addClass('bg--daytime');
                    } else if (now > sunset && now < twilight_end) {
                        console.log('it is now after sunset but still light');
                        $body
                            .removeClass()
                            .addClass('bg--evening');
                    } else if (now > twilight_end) {
                        console.log('it is now night');
                        $body
                            .removeClass()
                            .addClass('bg--night');
                    } else if (now > twilight_begin) {
                        console.log('it is predawn');
                        $body
                            .removeClass()
                            .addClass('bg--morning');
                    }

                    // add sun data
                    $('.js-sun-data .value').each(function(){
                        let name = $(this).data('name');
                        if (name !== 'day_length') {
                            $(this).html(moment(data.results[name]).format('LT'));
                        } else {
                            $(this).html(toHoursMinutesString(data.results[name]))
                        }
                    });
                },
                error: function (data) {
                    console.log(data);
                }
            });

        }
    };

    /**
     * Convert to XXh XXm format
     * @param number seconds
     * @returns {string}
     */
    function toHoursMinutesString(seconds) {
        let daylength_in_hours = seconds / 3600;
        let hours = parseInt(daylength_in_hours, 10);
        let minutes = parseInt(Math.round(( daylength_in_hours - hours) * 60), 10);

        return hours + 'h ' + minutes + 'm';
    }

})(jQuery, MoonFx);
/* end global.js */
