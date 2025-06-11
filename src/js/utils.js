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


/**
 * @param {string} html - HTML code representing single node
 * @returns {node} node made of html
 * @throws will throw an error if the html text can't be represented as a single node.
 */
export const htmlToNode = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  nodesNumber = template.content.childNodes.length;

  if (nodesNumber !== 1) {
    throw Error('There must be single node in html');
  }

  return template.content.firstChild;
};