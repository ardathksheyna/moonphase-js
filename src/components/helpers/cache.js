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
 * @param {string} key
 * @param {string} data
 * @param {string} type
 * @returns {void}
 */
export function setCacheData(key, data, type) {
    if (!localStorage) {
        return
    }

    let expires = 0
    if (!type || type === 'sun') {
        expires = ((Date.now() / 1000) + 43200)
    } else {
        expires = ((Date.now() / 1000) + 3600)
    }

    localStorage.setItem(key, data)
    localStorage.setItem(key + '--expires', expires)
}

/**
 * Retrieve previously cached data
 *
 * @param {string} key
 * @returns {string|boolean}
 */
export function getCacheData(key) {
    let expiration = localStorage.getItem(key + '--expires')
    let timestamp  = (Date.now() / 1000);
    if (expiration > timestamp) {
        localStorage.removeItem(key)
        localStorage.removeItem(key + '--expires')
    }

    let data = localStorage.getItem(key)
    if (!data) {
        return false
    }

    return data
}