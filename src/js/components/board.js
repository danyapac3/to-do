import Component from '/js/lib/component';
import {htmlToNode} from '/js/utils/dom';
import store from '/js/store/index';
import template from './board.html';
import List from './list';

export default class Board extends Component {

  constructor () {
    super({
      store,
      element: htmlToNode(template),
      subscriptions: ['setCurrentProjectId'],
    });


    this.init();
  }

  render() {
    const board = this.element;
    const title = board.querySelector('.board__title');
    const project = store.state.projects.find(p => p.id === store.state.currentProjectId);
    const boardContent = board.querySelector('.board__content');

    console.log(store.state.currentProjectId);

    if (project && project.listIds) {
      for (let listId of project.listIds) {
        const list = new List(listId, this);
        boardContent.append(list.element);
      }
    }

    if (project && project.title) {
      title.textContent = project.title;
    }
  }
}