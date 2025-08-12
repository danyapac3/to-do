import Component from '/js/lib/component';
import AddItemForm from '/js/components/add-item';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './list.html';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';
import Task from '/js/components/task';
import useTasksStore from '/js/stores/tasksStore';
import {format} from 'date-fns';


export default class DateList extends Component {
  constructor ({parent, store, props}) {
    super({
      props,
      store,
      parent,
      element: htmlToNode(template),
      stores: [useTasksStore()],
    });
  }

  init() {
    const $list = this.element;
    const $body = $list.querySelector('.list__body');

    this.sortable = new Sortable($body, {
      sort: false,
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
      }
    });
  }

  render({ startDate, endDate }) {
    const $list = this.element;
    const $body = this.element.querySelector('.list__body');
    const $footer = this.element.querySelector('.list__footer');
    const $title = $list.querySelector('.list__title');
    $list.dataset.startDate

    $title.value = "23 Aug - Today";

    const newTaskForm = new AddItemForm({
      parent: this,
      props: {title: 'Add new task'},
    });
    newTaskForm.on('save', ({text}) => {
    });
    
    $footer.appendChild(newTaskForm.element);
  }

  cleanUp() {
    this.sortable.destroy();
  }
}