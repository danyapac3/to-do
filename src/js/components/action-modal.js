import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './action-modal.html';


export default class ActionModal extends Component {
  constructor () {
    const {parent = null} = arguments.length ? arguments[0] : {};
    super({
      element: htmlToNode(template),
      parent: parent || null,
    });
  }
  
  init() {
    const $modal = this.element;
    const $modalPlace = document.querySelector('.modal-place');
    $modalPlace.appendChild($modal);
    const $content = $modal.querySelector('.action-modal__content');

    let startedOnChildren = false;

    $modal.addEventListener('click', (e) => {
      if (startedOnChildren) {
        startedOnChildren = true;
        return;
      }
      $modal.close();
      e.stopPropagation();
    });

    $modal.addEventListener('mousedown', (e) => {
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

  show(props) {
    const {x, y} = props;
    this.props = props;
    this.render();
    const $modal = this.element;
    $modal.showModal();

    const { width, height } = $modal.getBoundingClientRect();

    const right = x + width;
    const bottom = y + height;
    const windowRightShift = window.innerWidth - right;
    const windowBottomShift = window.innerHeight - bottom;
    const realX = windowRightShift < 0 ? x - width : x;
    const realY = windowBottomShift < 0 ? y - height : y;
    $modal.style.transform = `translate(${realX}px, ${realY}px)`;
  }
}