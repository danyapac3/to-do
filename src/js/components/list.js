import editIcon from '/images/icons/edit.svg';
import detailsIcon from '/images/icons/details.svg';
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
      subscriptions: ['addTask', 'moveTask'],
    });
  }

  init({id}) {
    const $list = this.element;
    const $body = $list.querySelector('.list__body');
    const $actionsButton = $list.querySelector('.list__show-actions-button');
    const $title = $list.querySelector('.list__title');
    const list = this.store.state.lists.find(l => l.id === id);

    $title.addEventListener('change', (e) => {
      if ($title.value === '') return;

      if (list.title !== $title.value) {
        this.store.dispatch('renameList', {id, title: $title.value});
        return;
      }
    });

    $title.addEventListener('blur', (e) => {
      if ($title.value === '') {
        $title.value = list.title;
        return;
      }
    });
    
    $actionsButton.addEventListener('click', (e) => {
      contextMenu.showWithItems([
        {
          title: 'Rename',
          iconSrc: editIcon,
          callback: () => { $title.focus() },
        },
        { 
          title: 'Details',
          iconSrc: detailsIcon,
          callback: () => alert('details'),
        },
        { 
          title: 'Remove',
          iconSrc: removeIcon,
          callback: () => {
            this.store.dispatch('removeList', {id});
          }
        },
      ]);
    });

    const sortable = new Sortable($body, {
      animation: 0,
      group: 'list',
      ghostClass: 'ghost',

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
    
    if (list) {
      $title.value = list.title;
    }

    list.taskIds.forEach(taskId => {
      const taskElement = new Task({parent: this, props: {id: taskId}}).element;
      $body.appendChild(taskElement);
    });

    const newTaskForm = new AddItemForm({
      parent: this,
      props: {title: 'Add new task'},
    });
    newTaskForm.on('save', ({text}) => {
      this.store.dispatch('addTask', {listId: id ,title: text});
    });
    
    $footer.appendChild(newTaskForm.element);
  }
}