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

  showWithItems(items, x = 0, y = 0, title) {
    const $contextMenu = this.element;
    const $title = $contextMenu.querySelector('.context-menu__title');
    const $items = $contextMenu.querySelector('.context-menu__items');
    $contextMenu.hidden = false;
    $title.textContent = title || '';
    $title.hidden = !title;

    $contextMenu.focus();
    items.forEach(({ title, iconSrc, callback }) => {
      const $item = createItem(title, iconSrc); 
      $item.addEventListener('click', () => {
        $contextMenu.blur();
        callback?.();
      });
      $items.appendChild($item);
    });

    const { width, height } = $contextMenu.getBoundingClientRect();
    const right = x + width;
    const bottom = y + height;
    const windowRightShift = window.innerWidth - right;
    const windowBottomShift = window.innerHeight - bottom;
    const realX = windowRightShift < 0 ? windowRightShift + x : x;
    const realY = windowBottomShift < 0 ? windowBottomShift + y : y;
    $contextMenu.style.transform = `translate(${realX}px, ${realY}px)`;
  }
}