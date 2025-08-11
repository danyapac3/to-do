import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './dialog.html';


export default class ActionModal extends Component {
  constructor ({props}) {
    const {parent = null} = arguments.length ? arguments[0] : {};
    super({
      props,
      element: htmlToNode(template),
      parent: parent || null,
    });
  }
  
  init() {
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

  render({ContentComponent}) {
    if (!this.element.open) return;
    const $dialog = this.element;
    const $content = $dialog.querySelector('.dialog__content');
    const contentComponent = new ContentComponent({parent: this, props: this.contentProps});
    $content.appendChild(contentComponent.element);
  }

  show(props) {
    const {x, y} = props;
    this.contentProps = props;
    const $dialog = this.element;
    $dialog.showModal();
    this.render();

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
    this.element.close();
    this.render();
  }
}