import Component from '/js/lib/component';
import template from './today-board.html';
import {htmlToNode} from '/js/lib/utils/dom';
import {isToday, isPast, isEqual, endOfDay} from  'date-fns';
import useTasksStore from '/js/stores/tasksStore';
import Task from '/js/components/task';

const tasksStore = useTasksStore();

const addTasksToList = (parent, tasks, $list) => {
  const $listBody = $list.querySelector('.list__body');

  for (let task of tasks) {
    const taskComponent = new Task({parent, props: {id: task.id}});
    $listBody.appendChild(taskComponent.element);
  }
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
    const $content = $board.querySelector('.board__content');
  }

  render() {
    const $board = this.element;
    const $inProgressList = $board.querySelector('.board__list[data-type="in-progress"');
    const $overdueList = $board.querySelector('.board__list[data-type="overdue"');
    const $completedList = $board.querySelector('.board__list[data-type="in-progress"');
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
      } else if (isPast(date)) {
        overdueTasks.push(task);
        continue;
      }
    }

    addTasksToList(this, inProgressTasks, $inProgressList);
  }
}