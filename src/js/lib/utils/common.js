import { format, endOfDay, isEqual, getYear, addDays, subDays} from 'date-fns';

/**
 * @callback Predicate
 * @param {string} - key
 * @param {*} - value
 * @returns {*} - will be interpreted as falsy or truthy value
 */

/**
 * Iterates through enumerable string properties within given object and its 
 * prototype chain and saves properties that satisfy given predicate.
 * @param {object} obj - source object
 * @param {Predicate} predicate
 * @returns {object} shallow copy of the source object with properties that are sutisfied with the predicate
 */
export const filterObject = (obj, predicate) => {
  return Object.entries(obj)
    .reduce((acc, [key, value]) => {
      if (predicate(key, value)) acc[key] = value;
      return acc;
    }, {});
}

export const formatDate = (date) => {
  const endOfDate = endOfDay(date);
  const now = new Date(Date.now());
  const today = endOfDay(now);
  const tomorrow = addDays(today, 1);
  const yesterday = subDays(today, 1);

  const isTimeShown = !isEqual(endOfDay(date), date);
  const isYearShown = getYear(date) !== getYear(now);

  let result = 
    isEqual(endOfDate, today) ? "Today"
    : isEqual(endOfDate, tomorrow) ? "Tomorrow"
    : isEqual(endOfDate, yesterday) ? "Yesterday"
    : format(date, "d MMM")

  result += isYearShown ? format(date, " yyyy") : "";
  result += isTimeShown ? format(date, " HH:mm") : "";

  return result;
}