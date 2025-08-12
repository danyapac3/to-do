import Dialog from "/js/components/dialog";
import Component from "/js/lib/component"
import template from "/js/components/action-menu.html";
import { htmlToNode } from '/js/lib/utils/dom';

const createItem = (title, iconSrc) => htmlToNode(
  `<div class="context-menu__item">
    ${iconSrc ? `<img class="context-menu__item-icon" src="${iconSrc}" alt="">` : ''}
    <div class="context-menu__item-title">${title || 'untitled'}</div>
  </div>`);

class ActionMenu extends Component {
  constructor ({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
    });
  }

  render({items, title}) {
    const $actionMenu = this.element;
    const $title = $actionMenu.querySelector('.action-menu__title');
    const $items = $actionMenu.querySelector('.action-menu__items');
    $actionMenu.hidden = false;
    $title.textContent = title || '';
    $title.hidden = !title;

    $actionMenu.focus();
    items.forEach(({ title, iconSrc, callback }) => {
      const $item = createItem(title, iconSrc); 
      $item.addEventListener('click', () => {
        this.parent.close();
        callback?.();
      });
      $items.appendChild($item);
    });
  }
}

export default function ({parent, props}) {
  if (!new.target) {
    throw new TypeError("calling Foo constructor without new is invalid");
  }
  
  return new Dialog({parent, props: {innerProps: props, ContentComponent: ActionMenu}});
}