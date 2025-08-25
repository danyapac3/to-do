import Component from '/js/lib/component';
import AddItemForm from '/js/components/add-item';
import template from './today-board.html';
import {htmlToNode} from '/js/lib/utils/dom';
import {isToday, isAfter, endOfDay} from  'date-fns';
import useTasksStore from '/js/stores/tasksStore';
import Task from '/js/components/task';
import DatePicker from '/js/components/date-picker';
import Sortable from 'sortablejs/modular/sortable.core.esm';

const tasksStore = useTasksStore();

const mountTasks = (parent, tasks, $mountPlace, hiddenDueDate = false) => {
  for (let task of tasks) {
    const taskComponent = new Task({parent, props: {id: task.id, hiddenDueDate}});
    $mountPlace.appendChild(taskComponent.element);
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
    const $overdueList = $board.querySelector('.simple-list[data-type="overdue"]');
    const $overdueTasks = $overdueList.querySelector('.simple-list__tasks');
    const $todayList = $board.querySelector('.simple-list[data-type="today"]');
    const $todayTasks = $todayList.querySelector('.simple-list__tasks');
    const $rescheduleButton = $overdueList.querySelector('.simple-list__reschedule-button');

    $board.addEventListener('click', (e) => {
      const {target} = e;
      if (target.classList.contains('simple-list__collapse-button'))
        target.closest('.simple-list').classList.toggle('simple-list--collapsed');
    });

    $board.addEventListener('scroll', (() => {
      let lastKnownScrollPosition = 0;
      
      return (e) => {
        const {scrollTop} = $board;
        if (scrollTop === lastKnownScrollPosition) return;

        lastKnownScrollPosition = scrollTop;
        $board.classList.toggle('board--scrolled', scrollTop > 0)
      };
    })());

    $rescheduleButton.addEventListener('click', (e) => {
      if (!$overdueTasks.children.length) return;

      const datepicker = new DatePicker({props: {x: e.pageX, y: e.pageY}});
      datepicker.on('submit', (date) => {
        const taskIds = [...$overdueTasks.children].map(taskElm => taskElm.dataset.id);

        tasksStore.setDueDates(taskIds, date.getTime());
      })
    });

    const overdueSortable = new Sortable($overdueTasks, {
      ...generalSortableRules,
      group: {
        put: false,
        pull: true,
      },
    });

    const todaySortable = new Sortable($todayTasks, {
      ...generalSortableRules,
      group: {
        put: true,
        pull: true,
      },

      onAdd({item}) {
        const id = item.dataset.id;
        tasksStore.setDueDate(id, endOfDay(new Date()).getTime());
      }
    })

    this.sortables = [overdueSortable, todaySortable];
  }

  render() {
    const $board = this.element;
    const $todayList = $board.querySelector('.simple-list[data-type="today"]');
    const $overdueList = $board.querySelector('.simple-list[data-type="overdue"]');
    const $todayTasks = $todayList.querySelector('.simple-list__tasks');
    const $overdueTasks = $overdueList.querySelector('.simple-list__tasks');

    const tasks = Object.values(tasksStore.$state);
    const todayTasks = [];
    const overdueTasks = [];

    const now = new Date();
    const today = endOfDay(now);

    for (let task of tasks) {
      const date = new Date(task.dueDate);
      if (!task.dueDate || task.completed || isAfter(date, today)) continue;

      (isToday(date) ? todayTasks : overdueTasks).push(task);
    }

    mountTasks(this, todayTasks, $todayTasks);
    mountTasks(this, overdueTasks, $overdueTasks);
  }

  cleanUp() {
    this.sortables.forEach(sortable => {
      sortable.destroy();
    });
  }
}