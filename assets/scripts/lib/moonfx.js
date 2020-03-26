const MoonFx = (function(){

    const MoonFx = {

        /**
         * Radius of Earth in miles
         */
        EARTH_RADIUS_MI: 3959,

        /**
         * Length of one day in seconds
         */
        ONE_DAY: 86400,

        /**
         * Moon's synodic period
         */
        SYNODIC_PERIOD: 29.530589,


        /**
         * Value of PI in radians
         */
        PI_RADIANS: Math.PI * 2,


        /**
         * Current date
         *
         * @type number
         */
        moonDate: new Date().getTime(),


        getMoonData: function() {
            return {
                "synodicAge" : toDaysHours(this.getSynodicPhase()),
                "julianDate" : this.getJulianDate().toFixed(4),
                "phaseAngle" : toDegrees(this.getPhaseAngle()),
                "distance"   : (this.getDistanceInEarthRadii() * this.EARTH_RADIUS_MI).toFixed(0).toString() + " mi",
                "illumination" : (this.getIlluminatedRatio() * 100).toFixed(0).toString() + "%"
            }
        },

        /**
         * Set the current date
         *
         * @param {number} date
         * @returns {undefined}
         */
        setDate: function(date) {
            this.moonDate = date;
        },


        /**
         * Get current date
         *
         * @returns {number}
         */
        getDate: function() {
            return this.moonDate;
        },


        /**
         * Get current Julian Date
         *
         * @returns {Number}
         */
        getJulianDate: function() {
            var time = this.getDate();

            return ((time / 1000) / this.ONE_DAY) + 2440587.5;
        },


        /**
         * Get current synodic phase (Moon's age)
         *
         * @returns {Number}
         */
        getSynodicPhase: function() {
            var julianDate   = this.getJulianDate(),
                synodicPhase = this._normalize((julianDate - 2451550.1) / this.SYNODIC_PERIOD)
                    * this.SYNODIC_PERIOD;

            return synodicPhase;
        },


        /**
         * Get current distance to the moon in Earth Radii
         *
         * @returns {Number}
         */
        getDistanceInEarthRadii: function() {
            var distanceInRadians = this._normalize((this.getJulianDate() - 2451562.2) / 27.55454988) * this.PI_RADIANS,
                synodicPhaseInRadians = this.getSynodicPhase() * this.PI_RADIANS,

                distance = 60.4 - 3.3 * Math.cos(distanceInRadians) - 0.6
                    * Math.cos(2 * synodicPhaseInRadians - distanceInRadians) - 0.5
                    * Math.cos(2 * synodicPhaseInRadians);

            return distance;
        },


        /**
         * Get Moon's current ecliptic latitude
         * @returns {Number}
         */
        getEclipticLatitude: function() {
            var value = this._normalize((this.getJulianDate() - 2451565.2) / 27.212220817),
                eclipticLatitude = 5.1 * Math.sin(value * this.PI_RADIANS);

            return eclipticLatitude;
        },


        /**
         * Get Moon's current ecliptic longitude
         * @returns {Number|_L1.MoonFx.getEclipticLongitude.value}
         */
        getEclipticLongitude: function() {
            var synodicPhaseInRadians = this.getSynodicPhase() * this.PI_RADIANS,
                distanceInRadians     = this._normalize((this.getJulianDate() - 245162.2) / 27.55454988) * this.PI_RADIANS,
                value                 = this._normalize((this.getJulianDate() - 2451555.8) / 27.321582241),

                eclipticLongitude = 360 * value + 6.3 + Math.sin(distanceInRadians) + 1.3
                    * Math.sin(2 * synodicPhaseInRadians - distanceInRadians) + 1.3
                    * 0.7 * Math.sin(2 * synodicPhaseInRadians);

            return eclipticLongitude;
        },


        /**
         * Get the current phase angle
         *
         * @param {Number} synodicAge
         * @returns {Number}
         */
        getPhaseAngle: function(synodicAge) {
            synodicAge = synodicAge ? synodicAge : this.getSynodicPhase();

            phaseAngle = synodicAge * (360 / this.SYNODIC_PERIOD);

            if (phaseAngle > 360) {
                phaseAngle = phaseAngle - 360;
            }

            return phaseAngle;

        },



        /**
         * Get moon illuminated ratio (in decimals)
         * @param {Number} synodicAge
         * @returns {Number}
         */
        getIlluminatedRatio: function(synodicAge) {
            synodicAge = synodicAge ? synodicAge : this.getSynodicPhase();

            var phaseAngle = this.getPhaseAngle(synodicAge),
                ratioOfIllumination = 0.5 * (1 - Math.cos(this._deg2rad(phaseAngle)));

            return ratioOfIllumination;
        },


        /**
         * Normalize a number
         *
         * @param {Number} value
         * @returns {Number}
         */
        _normalize: function(value) {
            value = value - parseInt(value);

            if (value < 0){
                value = value + 1;
            }

            return value;
        },


        /**
         * Find a number's sign
         *
         * @param {Number} $x
         * @returns {int}
         */
        _signum: function(x) {
            return parseInt((Math.abs(x) - x) ? -1 : x > 0);
        },


        /**
         * Convert degrees to radians
         *
         * @param {Number} x
         * @returns {Number|@exp;Math@pro;PI}
         */
        _deg2rad: function (x) {
            return x * (Math.PI / 180);
        },

    };

    return MoonFx;
}());