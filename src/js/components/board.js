import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './board.html';
import List from './list';
import AddItem from './add-item';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';
import useProjectsStore from "/js/stores/projectsStore";
import useListsStore from "/js/stores/projectsStore";

export default class Board extends Component {

  constructor ({parent, props}) {
    super({
      element: htmlToNode(template),
      parent,
      props
    });
  }

  init({id}) {
    // until fix
    return; 

    const project = this.store.state.projects.find(p => p.id === currentProjectId);
    const $board = this.element;
    const $content = $board.querySelector('.board__content');
    const sortable = new Sortable($content, {
      animation: 200,
      group: 'board',
      ghostClass: 'ghost',
      handle: '.list__header',

      setData: (dataTransfer, dragElm) => {
        dataTransfer.setData('Text', JSON.stringify({type: 'list', id: dragElm.dataset.id}));
      },

      onEnd: ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) return;
        this.store.dispatch('moveList', { 
          oldIndex,
          newIndex,
          sourceId: project.id,
          destinationId: project.id,
        });
      }
    });
  }

  render({id}) {
    const $board = this.element;
    const $title = $board.querySelector('.board__title');
    const $content = $board.querySelector('.board__content');
    const $addNewSectionFormPlace = $board.querySelector('.board__add-new-section-form-place');

    if (id === null) {
      $title.textContent = 'there is no selected project';
      return;
    }

    const projectsStore = useProjectsStore();
    const project = projectsStore[id]

    for (let listId of project.listIds) {
      const list = new List({ parent: this, props: {id: listId} });
      $content.append(list.element);
    }

    const addSectionForm = new AddItem({ parent: this, props: {title: 'Add new section'} });
    addSectionForm.on('save', ({text}) => {
      this.store.dispatch('addList', {title: text, projectId: project.id})
    });
    $addNewSectionFormPlace.appendChild(addSectionForm.element);

    if (project && project.title) {
      $title.textContent = project.title;
    }
  }

  changeProject(id) {
    this.props.id = id;
    this.render();
  }
}