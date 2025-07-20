import editIcon from '/images/icons/edit.svg';
import moveIcon from '/images/icons/move-to.svg';
import removeIcon from '/images/icons/bin.svg';

import { contextMenu } from '/js/shared/components';
import Component from '/js/lib/component';
import Task from '/js/components/task';
import AddItemForm from '/js/components/add-item';
import { htmlToNode, hideElement, showElement } from '/js/lib/utils/dom';
import template from './list.html';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';

export default class List extends Component {
  constructor ({parent, store, props}) {
    super({
      props,
      store,
      parent,
      element: htmlToNode(template),
      subscriptions: ['addTaskToList', 'moveTask'],
    });
  }

  init({id}) {
    const $list = this.element;
    const $body = $list.querySelector('.list__body');
    const $actionsButton = $list.querySelector('.list__show-actions-button');
    const $title = $list.querySelector('.list__title');
    const list = this.store.state.lists.find(l => l.id === id);
    const project = this.store.state.projects.find(p => p.listIds.includes(list.id));
    $title.addEventListener('change', (e) => {
      if ($title.value === '') return;
      $title.disabled = true;

      if (list.title !== $title.value) {
        this.store.dispatch('renameList', {id, title: $title.value});
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

    function moveListTo (projectId) {
      this.store.dispatch('moveListOutside', {
        sourceId: project.id,
        destinationId: projectId,
        listId: id,
      });
    };

    const showMoveMenu = (pageX, pageY) => {
      const availableProjects = this.store.state.projects.filter(p => !p.listIds.includes(id));
      const items = availableProjects.map(project => ({
        title: project.title,
        callback: moveListTo.bind(this, project.id),
      }));
      contextMenu.showWithItems(items, pageX, pageY, 'Move to');
    };

    const showActionMenu = ({pageX, pageY}) => {
      contextMenu.showWithItems([
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
            this.store.dispatch('removeList', {id});
          }
        },
      ], pageX, pageY, 'Actions');
    };
    
    $actionsButton.addEventListener('click', showActionMenu);

    const sortable = new Sortable($body, {
      animation: 0,
      delay: 150,
      delayOnTouchOnly: true,
      group: 'list',
      ghostClass: 'ghost',
      chosenClass: 'chosen',
      dragClass: 'drag',

      onStart: (event) => {
        $body.classList.add('has-dragging');
      },

      onEnd: ({ from: $from, to: $to, oldIndex, newIndex }) => {
        $body.classList.remove('has-dragging');

        const oldListId = $from.closest('.list').dataset.id;
        const newListId = $to.closest('.list').dataset.id;
        this.store.dispatch('moveTask', {oldListId, newListId, oldIndex, newIndex});
      }
    });
  }

  render({id}) {
    const $list = this.element;
    const $body = this.element.querySelector('.list__body');
    const $footer = this.element.querySelector('.list__footer');
    const $title = $list.querySelector('.list__title');
    const list = this.store.state.lists.find(l => l.id === id);
    $list.dataset.id = id;

    console.log(list);
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
      this.store.dispatch('addTask', {title: text, parent: list});
    });
    
    $footer.appendChild(newTaskForm.element);
  }
}