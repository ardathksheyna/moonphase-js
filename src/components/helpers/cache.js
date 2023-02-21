export const WEATHER_DATA = 'moonphase-app--weather'
export const SUN_DATA = 'moonphase-app--sun'

/**
 * Local Storage object
 * @type {Storage|boolean}
 */
let localStorage = false
if (typeof window.localStorage !== 'undefined') {
    localStorage = window.localStorage
}


/**
 * Set data in browser cache using LocalStorage
 *
 * @param {string} key Name of cache key
 * @param {string} data Data to be cached
 * @param {string} ttl Interval before data refresh in seconds
 * @returns {void}
 */
export function setCacheData(key, data, ttl:number) {
    if (!localStorage) {
        return
    }

    localStorage.setItem(key, data)
    localStorage.setItem(key + '--expires', ttl)
}

/**
 * Retrieve previously cached data
 *
 * @param {string} key
 * @returns {string|boolean}
 */
export function getCacheData(key) {
    if (isCacheExpired(key)) {
        localStorage.removeItem(key)
        localStorage.removeItem(key + '--expires')
    }

    let data = localStorage.getItem(key)
    if (!data) {
        return false
    }

    return data
}


/**
 * Check cache if expired. Expire cache if past midnight.
 *
 * @param {string} key
 * @return {boolean}
 */
function isCacheExpired(key) {
    let expiration = localStorage.getItem(key + '--expires')
    let timestamp  = (Date.now() / 1000)
    let midnight   = new Date().setHours(24, 0, 0, 0)

    if (timestamp > expiration) {
        return true
    }

    if (timestamp > midnight) {
        return true
    }

    return false
}