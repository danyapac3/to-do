/**
 * @param {string} html - HTML code representing single node
 * @returns {node} node made of html
 * @throws will throw an error if the html text can't be represented as a single node.
 */
export const htmlToNode = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const nodesNumber = template.content.childNodes.length;

  if (nodesNumber !== 1) {
    throw Error('There must be single node in html');
  }

  return template.content.firstChild;
};