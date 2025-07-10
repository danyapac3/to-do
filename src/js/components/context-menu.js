import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './context-menu.html';


export default class List extends Component {
  constructor ({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
      subscriptions: [],
    });
  }
  
  init({pageX, pageY}) {
    const $contextMenu = this.element;
    const $contextMenuPlace = document.querySelector('.context-menu-place');

    $contextMenuPlace.appendChild($contextMenu);
    $contextMenu.focus();
    $contextMenu.style.transform = `translate(${pageX || 0}px, ${pageY || 0}px)`;
    $contextMenu.addEventListener('blur', () => {
      this.destroy();
    });
  }

  render() {
  }
}