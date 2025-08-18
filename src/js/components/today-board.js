import Component from '/js/lib/component';
import AddItemForm from '/js/components/add-item';
import template from './today-board.html';
import {htmlToNode} from '/js/lib/utils/dom';
import {isToday, isPast, differenceInDays, addDays, endOfDay} from  'date-fns';
import useTasksStore from '/js/stores/tasksStore';
import Task from '/js/components/task';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';

const tasksStore = useTasksStore();

const addTasksToList = (parent, tasks, $list, hiddenDueDate = false) => {
  const $listBody = $list.querySelector('.list__body');

  for (let task of tasks) {
    const taskComponent = new Task({parent, props: {id: task.id, hiddenDueDate}});
    $listBody.appendChild(taskComponent.element);
  }
}

const generalSortableRules = {
  animation: 0,
  delay: 150,
  delayOnTouchOnly: true,
  group: 'list',
  ghostClass: 'ghost',
  chosenClass: 'chosen',
  dragClass: 'in-drag',
}

export default class TodayBoard extends Component {
  constructor ({parent, props}) {
    super({
      element: htmlToNode(template),
      parent,
      props,
      stores: [tasksStore],
    });

    this.currentId = null;
  }

  renderPredicate({name}) {
    return true;
  }

  init() {
    const $board = this.element;
    const $inProgressBody = $board.querySelector('.board__list[data-type="in-progress"] .list__body');
    const $overdueBody = $board.querySelector('.board__list[data-type="overdue"] .list__body');
    const $completedBody = $board.querySelector('.board__list[data-type="completed"] .list__body');

    const inProgressSortable = new Sortable($inProgressBody, {
      ...generalSortableRules,

      onAdd({item}) {
        const task = tasksStore[item.dataset.id];
        if (task.completed) {
          tasksStore.toggleCompleted(task.id);
          return;
        }

        const date = new Date(task.dueDate);
        if (!isToday(date)) {
          const newDate = addDays(date, differenceInDays(endOfDay(new Date()), date));
          tasksStore.setDueDate(task.id, newDate.getTime());
        }
      }
    });

    const overdueSortable = new Sortable($overdueBody, {
      ...generalSortableRules,
      group: {
        name: 'list',
        put: false,
      },
    });

    const completedSortable = new Sortable($completedBody, {
      ...generalSortableRules,

      onAdd({item}) {
        const task = tasksStore[item.dataset.id];
        if (!task.completed) {
          tasksStore.toggleCompleted(task.id);
        }
      }
    });

    this.sortables = [
      inProgressSortable,
      overdueSortable,
      completedSortable,
    ];
  }

  render() {
    const $board = this.element;
    const $inProgressList = $board.querySelector('.board__list[data-type="in-progress"]');
    const $overdueList = $board.querySelector('.board__list[data-type="overdue"]');
    const $completedList = $board.querySelector('.board__list[data-type="completed"]');
    const $inProgressFooter = $inProgressList.querySelector('.board__footer');
    const $title = $board.querySelector('.board__title');
    const $content = $board.querySelector('.board__content');
    const $addNewSectionFormPlace = $board.querySelector('.board__add-new-section-form-place');

    const tasks = Object.values(tasksStore.$state);
    const inProgressTasks = [];
    const completedTasks = [];
    const overdueTasks = [];

    for (let task of tasks) {
      if (!task.dueDate) continue;

      const date = new Date(task.dueDate);

      if (isToday(date)) {
        if (task.completed) completedTasks.push(task);
        else inProgressTasks.push(task);
        continue;
      } else if (isPast(date) && !task.completed) {
        overdueTasks.push(task);
        continue;
      }
    }

    addTasksToList(this, inProgressTasks, $inProgressList, true);
    addTasksToList(this, completedTasks, $completedList, true);
    addTasksToList(this, overdueTasks, $overdueList);

    // const addNewTaskForm = new addItemForm({parent: this, props: {}})
  }

  cleanUp() {
    this.sortables.forEach(sortable => {
      sortable.destroy();
    });
  }
}