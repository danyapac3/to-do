import Component from '/js/lib/component';
import {htmlToNode} from '/js/utils/dom';
import store from '/js/store/index';
import template from './board.html';

export default class Board extends Component {

  constructor () {
    super({
      store,
      element: htmlToNode(template),
    });
  }

  render() {
    const board = this.element;
    const title = board.querySelector('.board__title');
    const project = store.state.currentProject;


    if (project && project.title) {
      title.textContent = project.title;
    }
  }
}