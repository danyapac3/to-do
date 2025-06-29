import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './board.html';
import List from './list';
import AddItem from './add-item';

export default class Board extends Component {

  constructor ({store, parent}) {
    super({
      store,
      element: htmlToNode(template),
      subscriptions: ['setCurrentProjectId'],
      parent,
    });
  }

  render() {
    const board = this.element;
    const title = board.querySelector('.board__title');
    const project = this.store.state.projects.find(p => p.id === this.store.state.currentProjectId);
    const boardContent = board.querySelector('.board__content');
    const addNewSectionFormPlace = board.querySelector('.board__add-new-section-form-place');

    if (project && project.listIds) {
      for (let listId of project.listIds) {
        const list = new List({
          parent: this,
          props: {id: listId},
        });
        boardContent.append(list.element);
      }
    }

    const addSectionForm = new AddItem({
      parent: this,
      props: {title: 'Add new section'}
    });
    addNewSectionFormPlace.appendChild(addSectionForm.element);

    if (project && project.title) {
      title.textContent = project.title;
    }
  }
}