import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './dialog.html';


export default class Dialog extends Component {
  constructor ({parent, props}) {
    super({
      props,
      element: htmlToNode(template),
      parent: parent || null,
    });
  }
  
  init({props}) {
    const $dialog = this.element;
    const $modalPlace = document.querySelector('.modal-place');
    $modalPlace.appendChild($dialog);
    const $content = $dialog.querySelector('.dialog__content');

    let startedOnChildren = false;

    $dialog.addEventListener('click', (e) => {
      if (startedOnChildren) {
        startedOnChildren = true;
        return;
      }
      this.close();
      e.stopPropagation();
    });

    $dialog.addEventListener('mousedown', (e) => {
      startedOnChildren = false;
    });

    $content.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    $content.addEventListener('mousedown', (e) => {
      startedOnChildren = true;
      e.stopPropagation();
    });
  }

  render({ContentComponent, innerProps}) {
    const $dialog = this.element;
    const $content = $dialog.querySelector('.dialog__content');
    const contentComponent = new ContentComponent({parent: this, props: innerProps});
    $content.appendChild(contentComponent.element);

    this.show(innerProps.x, innerProps.y);
  }

  show(x, y) {
    const $dialog = this.element;
    $dialog.showModal();

    const { width, height } = $dialog.getBoundingClientRect();

    const right = x + width;
    const bottom = y + height;
    const windowRightShift = window.innerWidth - right;
    const windowBottomShift = window.innerHeight - bottom;
    const realX = windowRightShift < 0 ? x - width : x;
    const realY = windowBottomShift < 0 ? y - height : y;
    $dialog.style.transform = `translate(${realX}px, ${realY}px)`;
  }

  close() {
    this.destroy();
  }
}

export function extendDialog (Component) {
  return function ({parent, props}) {
    if (!new.target) {
      throw new TypeError("calling Foo constructor without new is invalid");
    }
    
    return new Dialog({parent, props: {innerProps: props, ContentComponent: Component}});
  }
}