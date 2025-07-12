import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './context-menu.html';


const createItem = (title, iconSrc) => htmlToNode(
  `<div class="context-menu__item">
    <img class="context-menu__item-icon" src="${iconSrc}" alt="">
    <div class="context-menu__item-title">${title}</div>
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
    
    const clickHandler = ({pageX, pageY}) => {
      if ($contextMenu.hidden) return;
      $contextMenu.focus();
      $contextMenu.style.transform = `translate(${pageX || 0}px, ${pageY || 0}px)`;
    }
    
    document.addEventListener('click', clickHandler);
  }

  showWithItems(items) {
    const $contextMenu = this.element;

    const $items = $contextMenu.querySelector('.context-menu__items');
    $contextMenu.hidden = false;
    items.forEach(({ title, iconSrc, callback }) => {
      const $item = createItem(title, iconSrc); 
      $item.addEventListener('click', () => {
        $contextMenu.blur();
        callback();
      });
      $items.appendChild($item);
    });
  }
}