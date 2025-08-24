import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './dialog.html';


export default class Dialog extends Component {
  constructor ({props}) {
    super({
      props,
      element: htmlToNode(template),
      parent: null
    });
  }
  
  init({hasBackdrop}) {
    const $dialog = this.element;
    const $modalPlace = document.querySelector('.modal-place');
    $modalPlace.appendChild($dialog);
    const $content = $dialog.querySelector('.dialog__content');

    $dialog.classList.toggle('dialog--backdrop', !!hasBackdrop);

    let startedOnChildren = false;

    $dialog.addEventListener('close', e => {
      this.close();
    });

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

  render(props) {
    const {ControlledComponent, hasBackdrop, ...otherProps} = props;
    const $dialog = this.element;
    const $content = $dialog.querySelector('.dialog__content');
    const controlledComponent = new ControlledComponent({parent: this, props: otherProps});
    $content.appendChild(controlledComponent.element);

    this.show(props.x, props.y);
  }

  show(x, y) {
    const $dialog = this.element;
    const $content = this.element.querySelector('.dialog__content');
    $dialog.showModal();

    if(!(x && y)) {
      $dialog.classList.add('dialog--centered');
      return;
    }

    const { width, height } = $content.getBoundingClientRect();

    const right = x + width;
    const bottom = y + height;
    const windowRightShift = window.innerWidth - right;
    const windowBottomShift = window.innerHeight - bottom;
    const realX = windowRightShift < 0 ? x - width : x;
    const realY = windowBottomShift < 0 ? y - height : y;
    $content.style.transform = `translate(${realX}px, ${realY}px)`;
  }

  close() {
    this.destroy();
  }
}

export function extendDialog (Component) {
  return function ({props}) {
    if (!new.target) {
      throw new TypeError("calling Foo constructor without new is invalid");
    }
    
    return new Dialog({props: {...props, ControlledComponent: Component}});
  }
}