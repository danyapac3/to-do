import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/dom';
import store from '/js/store/index';
import template from './board.html';

export default class Board extends Component {
  #projectId;

  constructor (projectId) {
    super({
      store,
      element: htmlToNode(template),
    });

    this.projectId = projectId;
  }

  render() {
    const board = this.element;
    const title = board.querySelector('.board__title');

    title.textContent(this.#projectId);
  }
}