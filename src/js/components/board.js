import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './board.html';
import List from './list';
import AddItem from './add-item';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';

export default class Board extends Component {

  constructor ({parent}) {
    super({
      element: htmlToNode(template),
      subscriptions: ['setCurrentProjectId', 'addList', 'removeList', 'moveListOutside'],
      parent,
    });
  }

  init() {
    const project = this.store.state.projects.find(p => p.id === this.store.state.currentProjectId);
    const $board = this.element;
    const $content = $board.querySelector('.board__content');
    const sortable = new Sortable($content, {
      animation: 200,
      group: 'board',
      ghostClass: 'ghost',
      handle: '.list__header',

      onEnd: ({ oldIndex, newIndex }) => {
        this.store.dispatch('moveList', { 
          oldIndex,
          newIndex,
          sourceId: project.id,
          destinationId: project.id,
        });
      }
    });
  }

  render() {
    const $board = this.element;
    const $title = $board.querySelector('.board__title');
    const $content = $board.querySelector('.board__content');
    const $addNewSectionFormPlace = $board.querySelector('.board__add-new-section-form-place');
    const project = this.store.state.projects.find(p => p.id === this.store.state.currentProjectId);

    for (let listId of project.listIds) {
      const list = new List({ parent: this, props: {id: listId} });
      $content.append(list.element);
    }

    const addSectionForm = new AddItem({
      parent: this,
      props: {title: 'Add new section'}
    });
    addSectionForm.on('save', ({text}) => {
      this.store.dispatch('addList', {title: text, projectId: project.id})
    });
    $addNewSectionFormPlace.appendChild(addSectionForm.element);

    if (project && project.title) {
      $title.textContent = project.title;
    }
  }
}