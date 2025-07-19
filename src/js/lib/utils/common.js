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

export const projectById = (state, id) => state.projects.find(p => p.id === id); 
export const listById = (state, id) => state.lists.find(l => l.id === id); 
export const taskById = (state, id) => state.tasks.find(t => t.id === id); 