import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './task-modal.html';

export default class Sidebar extends Component {
  constructor() {
    super({
      element: htmlToNode(template),
      subscriptions: [],
    });
  }

  init() {
    const $modalPlace = document.querySelector('.modal-place');
    $modalPlace.append(this.element);
  }

  render() {

  }
}