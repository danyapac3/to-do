import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './project-board.html';
import List from './list';
import AddItem from './add-item';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';
import useProjectsStore from "/js/stores/projectsStore";
import useListsStore from "/js/stores/listsStore";
import HuePicker from "/js/components/hue-picker";

export default class ProjectBoard extends Component {
  constructor ({parent, props}) {
    super({
      element: htmlToNode(template),
      parent,
      props,
      stores: [useListsStore(), useProjectsStore()],
    });

    this.currentId = null;
  }

  renderPredicate({name}) {
    return (name === 'addList')
    || (name === 'moveListToProject')
    || (name === 'removeList')
    || (name === 'renameProject');
  }

  init({id}) {
    const projectsStore = useProjectsStore();
    const $board = this.element;
    const $content = $board.querySelector('.board__content');
    const $huePicker = $board.querySelector('.board__hue-picker');

    $huePicker.addEventListener('click', ({pageX, pageY}) => {
      const huePicker = new HuePicker({parent: this, props: {
        x: pageX, y: pageY,
        onChange: (hue) => {
          projectsStore.setHue(id, hue);
          $huePicker.style.backgroundColor = `hsl(${hue} 100%, 50%)`;
          $board.style.setProperty('--hue', hue);
        },
        onUpdate: (hue) => {
          $huePicker.style.backgroundColor = `hsl(${hue} 100%, 50%)`;
          $board.style.setProperty('--hue', hue);
        },
      }});
    });

    this.sortable = new Sortable($content, {
      animation: 200,
      group: 'board',
      ghostClass: 'ghost',
      dragClass: 'in-drag',
      chosenClass: 'chosen',
      handle: '.list__header',

      setData: (dataTransfer, dragElm) => {
        dataTransfer.setData('Text', JSON.stringify({type: 'list', id: dragElm.dataset.id}));
      },

      onEnd: ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) return;
        projectsStore.moveList(id, oldIndex, newIndex);
      }
    });
  }

  render({id}) {
    const $board = this.element;
    const $title = $board.querySelector('.board__title');
    const $content = $board.querySelector('.board__content');
    const $addNewSectionFormPlace = $board.querySelector('.board__add-new-section-form-place');
    const $huePicker = $board.querySelector('.board__hue-picker');

    if (id === null) {
      $title.textContent = 'there is no selected project';
      return;
    }

    const projectsStore = useProjectsStore();

    const project = projectsStore[id]

    if (project.hue) {
      $board.style.setProperty('--hue', project.hue)
      $huePicker.style.backgroundColor = `hsl(${project.hue}, 100%, 50%)`;
    }

    for (let listId of project.listIds) {
      const list = new List({ parent: this, props: {id: listId} });
      $content.append(list.element);
    }

    const addSectionForm = new AddItem({ parent: this, props: {title: 'Add new section'} });
    addSectionForm.on('save', ({text}) => {
      projectsStore.addList(id, text);
    });
    $addNewSectionFormPlace.appendChild(addSectionForm.element);

    if (project && project.title) {
      $title.textContent = project.title;
    }
  }

  cleanUp() { this.sortable.destroy(); }
}