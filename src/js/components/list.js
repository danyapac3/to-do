import editIcon from '/images/icons/edit.svg';
import moveIcon from '/images/icons/move-to.svg';
import removeIcon from '/images/icons/bin.svg';

import ActionMenu from '/js/components/action-menu';
import Component from '/js/lib/component';
import Task from '/js/components/task';
import AddItemForm from '/js/components/add-item';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './list.html';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';
import useListsStore from '/js/stores/listsStore';
import useProjectsStore from '/js/stores/projectsStore';

const listsStore = useListsStore();
const projectsStore = useProjectsStore();

export default class List extends Component {
  constructor ({parent, store, props}) {
    super({
      props,
      store,
      parent,
      element: htmlToNode(template),
      stores: [listsStore],
    });
  }

  renderPredicate({name, args, store, returnValue}) {
    return (
      (name === 'addTask' && args[0] === this.props.id)
      || (name === 'moveTaskToList') && (this.props.id === args[0] || this.props.id === args[1])
    );
  }

  init({id}) {
    const $list = this.element;
    const $body = $list.querySelector('.list__body');
    const $actionsButton = $list.querySelector('.list__show-actions-button');
    const $title = $list.querySelector('.list__title');
    const list = listsStore[id];
    const project = projectsStore[list.parentId];
    $title.addEventListener('change', (e) => {
      if ($title.value === '') return;
      $title.disabled = true;

      if (list.title !== $title.value) {
        listsStore.renameList(id, $title.value)
        return;
      }
    });

    $title.addEventListener('blur', (e) => {
      $title.disabled = true;
      if ($title.value === '') {
        $title.value = list.title;
        return;
      }
    });

    function moveListToProject (destinationId) {
      useProjectsStore().moveListToProject(id, project.id, destinationId);
    };

    const showMoveMenu = (pageX, pageY) => {
      const availableProjects = Object.values(projectsStore).filter(p => p !== project);
      const items = availableProjects.map(project => ({
        title: project.title,
        callback: moveListToProject.bind(this, project.id),
      }));
      const actionMenu = new ActionMenu({
        parent: this, 
        props: { items, x: pageX, y: pageY, title: 'moveTo' },
      });
    };

    const showActionMenu = ({pageX, pageY}) => {
      const actionMenu = new ActionMenu({
        parent: this, 
        props: {
          items: [
            {
              title: 'Rename',
              iconSrc: editIcon,
              callback: () => { $title.disabled = false; $title.focus(); },
            },
            { 
              title: 'Move to',
              iconSrc: moveIcon,
              callback: () => showMoveMenu(pageX, pageY),
            },
            { 
              title: 'Remove',
              iconSrc: removeIcon,
              callback: () => {
                listsStore.removeList(id);
              }
            }
          ], 
          x: pageX,
          y: pageY,
          title: 'Actions'
        }
      });
    };
    
    $actionsButton.addEventListener('click', showActionMenu);

    this.sortable = new Sortable($body, {
      animation: 0,
      delay: 150,
      delayOnTouchOnly: true,
      group: 'list',
      ghostClass: 'ghost',
      chosenClass: 'chosen',
      dragClass: 'in-drag',

      onStart: () => {
        $body.classList.add('has-dragging');
      },

      onEnd: ({ from: $from, to: $to, oldIndex, newIndex }) => {
        $body.classList.remove('has-dragging');

        const oldListId = $from.closest('.list').dataset.id;
        const newListId = $to.closest('.list').dataset.id;
        
        if(oldListId === newListId) {
          listsStore.moveTask(newListId, oldIndex, newIndex);
        } else {
          listsStore.moveTaskToList(oldListId, newListId, oldIndex, newIndex);
        }
      },

      onAdd: () => {

      },
    });
  }

  render({id}) {
    const listsStore = useListsStore();
    const list = listsStore[id];
    const $list = this.element;
    const $body = this.element.querySelector('.list__body');
    const $footer = this.element.querySelector('.list__footer');
    const $title = $list.querySelector('.list__title');
    $list.dataset.id = id;

    $title.value = list.title;

    list.taskIds.forEach(taskId => {
      const taskElement = new Task({parent: this, props: {id: taskId}}).element;
      $body.appendChild(taskElement);
    });

    const newTaskForm = new AddItemForm({
      parent: this,
      props: {title: 'Add new task'},
    });
    newTaskForm.on('save', ({text}) => {
      listsStore.addTask(id, text);
    });
    
    $footer.appendChild(newTaskForm.element);
  }

  cleanUp() {
    this.sortable.destroy();
  }
}