
/**
 * New Moon
 */
const AGE_NEW_MOON = 0

/**
 * First Quarter Moon
 */
const AGE_FIRST_QUARTER_MOON = 7

/**
 * Full Moon
 */
const AGE_FULL_MOON = 14

/**
 * Last Quarter Moon
 */
const AGE_LAST_QUARTER_MOON = 21

const NEW_MOON         = "New Moon"
const WAXING_CRESCENT  = "Waxing Crescent"
const FIRST_QUARTER    = "First Quarter"
const WAXING_GIBBOUS   = "Waxing Gibbous"
const FULL_MOON        = "Full Moon"
const WANING_GIBBOUS   = "Waning Gibbous"
const LAST_QUARTER     = "Last Quarter"
const WANING_CRESCENT  = "Waning Crescent"

export function getPhaseNames(synodicAge) {
    let phaseName = '';

    if (synodicAge >= AGE_NEW_MOON && synodicAge < 1) {
        // New Moon
        phaseName = NEW_MOON;
    } else if (synodicAge >= 1 && synodicAge < AGE_FIRST_QUARTER_MOON) {
        // Waxing Crescent
        phaseName = WAXING_CRESCENT;
    } else if (synodicAge >= AGE_FIRST_QUARTER_MOON && synodicAge < (AGE_FIRST_QUARTER_MOON + 1)) {
        // First Quarter Moon
        phaseName = FIRST_QUARTER;
    } else if (synodicAge > (AGE_FIRST_QUARTER_MOON + 1) && synodicAge < AGE_FULL_MOON) {
        // Waxing Gibbous
        phaseName = WAXING_GIBBOUS;
    } else if (synodicAge >= AGE_FULL_MOON && synodicAge < (AGE_FULL_MOON + 1)) {
        // Full Moon
        phaseName = FULL_MOON;
    } else if (synodicAge >= (AGE_FULL_MOON + 1) && synodicAge < AGE_LAST_QUARTER_MOON) {
        // Waning Gibbous
        phaseName = WANING_GIBBOUS;
    } else if (synodicAge >= AGE_LAST_QUARTER_MOON && synodicAge < (AGE_LAST_QUARTER_MOON + 1)) {
        // Last Quarter Moon
        phaseName = LAST_QUARTER;
    } else {
        // Waning Crescent
        phaseName = WANING_CRESCENT;
    }

    return phaseName;
}