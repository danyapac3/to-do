/**
 * @param {Number} min
 * @param {Number} max
 * @param {Number} x
 * @returns {Number}
 */
export const clamp = (min, max, x) => Math.min(Math.max(x, min), max);

/**
 * @param {Date} d1
 * @param {Date} d2
 * @returns {Number} - 1 if d1 is greater than d2, -1 if it's less, and 0 if they are equal
 */
export const compareDates = (d1, d2) => clamp(-1, 1, d1.getTime() - d2.getTime());
