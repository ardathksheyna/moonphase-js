/**
 * functions.js
 */
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

/* end functions.js */

/* moonfx.js */
MoonFx = (function(){

    var MoonFx = function() {

        /**
         * Radius of Earth in miles
         */
        this.EARTH_RADIUS_MI = 3959;

        /**
         * Length of one day in seconds
         */
        this.ONE_DAY = 86400;

        /**
         * Moon's synodic period
         */
        this.SYNODIC_PERIOD = 29.530589;


        /**
         * Value of PI in radians
         */
        this.PI_RADIANS = Math.PI * 2;


        /**
         * Current date
         *
         * @type long
         */
        this.moonDate = new Date().getTime();


        this.MOON_DATA = {
            "synodicAge" : toDaysHours(this.getSynodicPhase()),
            "julianDate" : this.getJulianDate().toFixed(4),
            "phaseAngle" : toDegrees(this.getPhaseAngle()),
            "distance"   : (this.getDistanceInEarthRadii() * this.EARTH_RADIUS_MI).toFixed(0).toString() + " mi",
            "illumination" : (this.getIlluminatedRatio() * 100).toFixed(0).toString() + "%"
        };

        return this;
    };

    /**
     * Set the current date
     *
     * @param {long} date
     * @returns {undefined}
     */
    MoonFx.prototype.setDate = function(date) {
        this.moonDate = date;
    };


    /**
     * Get current date
     *
     * @returns {long}
     */
    MoonFx.prototype.getDate = function() {
        return this.moonDate;
    };


    /**
     * Get current Julian Date
     *
     * @returns {Number}
     */
    MoonFx.prototype.getJulianDate = function() {
        var time = this.getDate();

        return ((time / 1000) / this.ONE_DAY) + 2440587.5;
    };


    /**
     * Get current synodic phase (Moon's age)
     *
     * @returns {Number}
     */
    MoonFx.prototype.getSynodicPhase = function() {
        var julianDate   = this.getJulianDate(),
            synodicPhase = this._normalize((julianDate - 2451550.1) / this.SYNODIC_PERIOD)
                            * this.SYNODIC_PERIOD;

        return synodicPhase;
    };


    /**
     * Get current distance to the moon in Earth Radii
     *
     * @returns {Number}
     */
    MoonFx.prototype.getDistanceInEarthRadii = function() {
        var distanceInRadians = this._normalize((this.getJulianDate() - 2451562.2) / 27.55454988) * this.PI_RADIANS,
            synodicPhaseInRadians = this.getSynodicPhase() * this.PI_RADIANS,

            distance = 60.4 - 3.3 * Math.cos(distanceInRadians) - 0.6
                    * Math.cos(2 * synodicPhaseInRadians - distanceInRadians) - 0.5
                    * Math.cos(2 * synodicPhaseInRadians);

        return distance;
    };


    /**
     * Get Moon's current ecliptic latitude
     * @returns {Number}
     */
    MoonFx.prototype.getEclipticLatitude = function() {
        var value = this._normalize((this.getJulianDate() - 2451565.2) / 27.212220817),
            eclipticLatitude = 5.1 * Math.sin(value * this.PI_RADIANS);

        return eclipticLatitude;
    };


    /**
     * Get Moon's current ecliptic longitude
     * @returns {Number|_L1.MoonFx.MoonFx.prototype.getEclipticLongitude.value}
     */
    MoonFx.prototype.getEclipticLongitude = function() {
        var synodicPhaseInRadians = this.getSynodicPhase() * this.PI_RADIANS,
            distanceInRadians     = this._normalize((this.getJulianDate() - 245162.2) / 27.55454988) * this.PI_RADIANS,
            value                 = this._normalize((this.getJulianDate() - 2451555.8) / 27.321582241),

            eclipticLongitude = 360 * value + 6.3 + Math.sin(distanceInRadians) + 1.3
                               * Math.sin(2 * synodicPhaseInRadians - distanceInRadians) + 1.3
                               * 0.7 * Math.sin(2 * synodicPhaseInRadians);

        return eclipticLongitude;
    };


    /**
     * Get the current phase angle
     *
     * @param {Number} synodicAge
     * @returns {Number}
     */
    MoonFx.prototype.getPhaseAngle = function(synodicAge) {
        synodicAge = synodicAge ? synodicAge : this.getSynodicPhase();

        phaseAngle = synodicAge * (360 / this.SYNODIC_PERIOD);

        if (phaseAngle > 360) {
            phaseAngle = phaseAngle - 360;
        }

        return phaseAngle;

    };



    /**
     * Get moon illuminated ratio (in decimals)
     * @param {Number} synodicAge
     * @returns {Number}
     */
    MoonFx.prototype.getIlluminatedRatio = function(synodicAge) {
        synodicAge = synodicAge ? synodicAge : this.getSynodicPhase();

        var phaseAngle = this.getPhaseAngle(synodicAge),
            ratioOfIllumination = 0.5 * (1 - Math.cos(this._deg2rad(phaseAngle)));

        return ratioOfIllumination;
    };


    /**
     * Normalize a number
     *
     * @param {Number} value
     * @returns {Number}
     */
    MoonFx.prototype._normalize = function(value) {
        value = value - parseInt(value);

        if (value < 0){
            value = value + 1;
        }

        return value;
    };


    /**
     * Find a number's sign
     *
     * @param {Number} $x
     * @returns {int}
     */
    MoonFx.prototype._signum = function(x) {
        return parseInt((Math.abs(x) - x) ? -1 : x > 0);
    };


    /**
     * Convert degrees to radians
     *
     * @param {Number} x
     * @returns {Number|@exp;Math@pro;PI}
     */
    MoonFx.prototype._deg2rad = function (x) {
        return x * (Math.PI / 180);
    };

    return MoonFx;
}());
/* end moonfx.js */

/* global.js */
(function($){

    // DOM ready
    $(function(){
        MoonPhase.DrawMoon.init();
        MoonPhase.Navigation.init();
        MoonPhase.DrawFavicon.init();
        MoonPhase.LoadData.init();
        MoonPhase.SunriseSunset.init();
    });

    var MoonPhase = MoonPhase || {};

    var debug = false;

    MoonPhase.moonFx = new MoonFx();
    MoonPhase.currentTime = new Date().getTime();

    MoonPhase.PhaseNames = {
        /**
         * New Moon
         */
        this.AGE_NEW_MOON = 0;

        /**
         * First Quarter Moon
         */
        this.AGE_FIRST_QUARTER_MOON = 7;

        /**
         * Full Moon
         */
        this.AGE_FULL_MOON = 14;

        /**
         * Last Quarter Moon
         */
        this.AGE_LAST_QUARTER_MOON = 21;

        this.NEW_MOON        = "NewMoon";
        this.WAXING_CRESCENT = "WaxingCrescent";
        this.FIRST_QUARTER   = "FirstQuarter";
        this.WAXING_GIBBOUS  = "WaxingGibbous";
        this.FULL_MOON       = "FullMoon";
        this.WANING_GIBBOUS  = "WaningGibbous";
        this.LAST_QUARTER    = "LastQuarter";
        this.WANING_CRESCENT = "WaningCrescent";

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
                phaseName = FIRST_QUARTER;
            } else if (synodicAge > (this.AGE_FIRST_QUARTER_MOON + 1) && synodicAge < this.AGE_FULL_MOON) {
                // Waxing Gibbous
                phaseName = WAXING_GIBBOUS;
            } else if (synodicAge >= this.AGE_FULL_MOON && synodicAge < (this.AGE_FULL_MOON + 1)) {
                // Full Moon
                phaseName = FULL_MOON;
            } else if (synodicAge >= (this.AGE_FULL_MOON + 1) && synodicAge < this.AGE_LAST_QUARTER_MOON) {
                // Waning Gibbous
                phaseName = WANING_GIBBOUS;
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
            var ctx = this.context,
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
            var points = [[], []];

            for (var a = 0; a < 180; a++) {
                var angle = this.moonFx._deg2rad(a - 90),
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

                var y2 = cy + y1,
                    p1 = [x1, y2],
                    p2 = [x2, y2];

                points[0].push(p1);
                points[1].push(p2);
            }

            var newPoints = points[0].concat(points[1].reverse());
            ctx.beginPath();
            ctx.fillStyle = '#000';
            for (var n in newPoints) {
                var p = newPoints[n];
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
            var moonData = MoonPhase.moonFx.MOON_DATA;
            
            moonData['phaseName'] = this.PhaseNames.getPhaseName(this.moonFx.getSynodicPhase())

            $('.js-moon-data .value').each(function(){
                var name = $(this).data('name');
                $(this).html(moonData[name]);
            });
        }
    };

    MoonPhase.Navigation = {
        init : function() {
            $('.js-current-date-value').text(function(){
                var dateObj = new Date();

                return dateObj.toLocaleDateString() + " @ " + dateObj.toLocaleTimeString();
            });


            $('.js-date-nav').on('click', function(e){
                e.preventDefault();

                var action = $(this).data('name'),
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

            var link = document.createElement('link'),
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
            var self = this;
            moment.tz.add('America/Chicago|LMT CST CDT EST CWT CPT|5O.A 60 50 50 50 50|012121212121212121212121212121212121213121212121214512121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-3tFG0 1nEe0 1nX0 11B0 1nX0 1wp0 TX0 WN0 1qL0 1cN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 11B0 1Hz0 14p0 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|92e5');
            navigator.geolocation.getCurrentPosition(function(position) {
                self.getSunRiseSet(position);
            });

        },

        getSunRiseSet : function (position) {
            var coords = $.param({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                date: moment(new Date()).format('YYYY-MM-DD'),
                formatted: 0
            });

            var endPoint = this.apiEndPoint;
            if (debug) {
                endPoint = this.apiEndPointTest;
            }

            var $body = $('body');

            $.ajax({
                url: endPoint,
                jsonp: true,
                data: coords,
                success: function (data) {
                    var sunrise = new Date(data.results.sunrise).getTime();
                    var sunset = new Date(data.results.sunset).getTime();
                    var twilight_end = new Date(data.results.civil_twilight_end).getTime();
                    var twilight_begin = new Date(data.results.civil_twilight_begin).getTime();
                    var now = Date.now();

                    if (sunrise < now && now < sunset) {
                        console.log('its after sunrise but before sunset');
                        $body.addClass('bg--daytime');
                    } else if (now > sunset && now < twilight_end) {
                        console.log('it is now after sunset');
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
                },
                error: function (data) {
                    console.log(data);
                }
            });

        }
    };

})(jQuery);
/* end global.js */
