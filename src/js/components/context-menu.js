import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './context-menu.html';


const createItem = (title, iconSrc) => htmlToNode(
  `<div class="context-menu__item">
    ${iconSrc ? `<img class="context-menu__item-icon" src="${iconSrc}" alt="">` : ''}
    <div class="context-menu__item-title">${title || 'untitled'}</div>
  </div>`);


export default class List extends Component {
  constructor () {
    super({
      element: htmlToNode(template),
      subscriptions: [],
    });
  }
  
  init() {
    const $contextMenu = this.element;
    const $items = $contextMenu.querySelector('.context-menu__items');
    const $contextMenuPlace = document.querySelector('.context-menu-place');

    $contextMenuPlace.appendChild($contextMenu);
    $contextMenu.hidden = true;

    $contextMenu.addEventListener('blur', () => {
      $contextMenu.hidden = true;
      [...$items.children].forEach($item => $item.remove());
    });
  }

  showWithItems(items, pageX = 0, pageY = 0) {
    const $contextMenu = this.element;
    
    const $items = $contextMenu.querySelector('.context-menu__items');
    $contextMenu.style.transform = `translate(${pageX || 0}px, ${pageY || 0}px)`;
    $contextMenu.hidden = false;
    $contextMenu.focus();
    items.forEach(({ title, iconSrc, callback }) => {
      const $item = createItem(title, iconSrc); 
      $item.addEventListener('click', () => {
        $contextMenu.blur();
        callback?.();
      });
      $items.appendChild($item);
    });
  }
}