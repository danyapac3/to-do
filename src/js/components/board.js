import Component from '/js/lib/component';
import {htmlToNode} from '/js/utils/dom';
import store from '/js/store/index';
import template from './board.html';

import BoardSection from './board-section';

export default class Board extends Component {

  constructor () {
    super({
      store,
      element: htmlToNode(template),
    });

    this.init()
  }

  render() {
    const board = this.element;
    const title = board.querySelector('.board__title');
    const project = store.state.projects.find(p => p.id === store.state.currentProjectId);
    const boardContent = board.querySelector('.board__content');

    if (project && project.sectionIds) {
      const sections = [];
      for (let sectionId of project.sectionIds) {
        const section = new BoardSection(sectionId);
        sections.push(section);
      }
    }

    if (project && project.title) {
      title.textContent = project.title;
    }
  }
}