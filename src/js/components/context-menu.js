import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './context-menu.html';


const createItem = (title, iconSrc) => htmlToNode(
  `<div class="context-menu__item">
    <img class="context-menu__item-icon" src="${iconSrc}" alt="">
    <div class="context-menu__item-title">${title}</div>
  </div>`);


export default class List extends Component {
  constructor ({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
      subscriptions: [],
    });
  }
  
  init({items}) {
    const $contextMenu = this.element;
    const $contextMenuPlace = document.querySelector('.context-menu-place');
    const clickHandler = ({pageX, pageY}) => {
      $contextMenuPlace.appendChild($contextMenu);
      $contextMenu.focus();
      $contextMenu.style.transform = `translate(${pageX || 0}px, ${pageY || 0}px)`;
      document.removeEventListener('click', clickHandler);
 
      $contextMenu.onblur = () => {
        this.destroy();
      }
    }


    document.addEventListener('click', clickHandler);
  }

  render({items}) {
    const $contextMenu = this.element;
    const $items = $contextMenu.querySelector('.context-menu__items');
    items.forEach(({ title, iconSrc, eventName }) => {
      const $item = createItem(title, iconSrc); 
      $items.appendChild($item);
      $item.addEventListener('click', () => {
        $contextMenu.onblur = null;
        this.emit(eventName);
        this.destroy();
      });
    });
  }
}