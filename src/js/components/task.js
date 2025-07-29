import Component from '/js/lib/component';
import { contextMenu, taskModal } from '/js/shared/components';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './task.html';
import useTasksStore from '/js/stores/tasksStore';

const tasksStore = useTasksStore();

export default class Task extends Component {
  constructor({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
      stores: [tasksStore],
    });
  }

  renderPredicate({name, args, returnValue}) {
    if (
      (name === 'addTask' 
      || name === 'removeTask'
      || name === 'toggleCompleted')
      && returnValue.parentId === this.props.id
    ) {
      return true;
    } 
    if (args[0] === this.props.id) return true;
  }

  init({id}) {
    const $task = this.element;
    const $title = $task.querySelector('.task__title');
    const $checkbox = $task.querySelector('.task__checkbox');

    $checkbox.addEventListener('click', () => {
      tasksStore.toggleCompleted(id);
    });

    $title.addEventListener('click', () => {
      taskModal.showWithTask(id);
    });
  }

  render({id}) {
    const task = tasksStore[id];
    const $task = this.element;
    const $title = $task.querySelector('.task__title');
    const $checkbox = $task.querySelector('.task__checkbox');
    const $indicatorBox = $task.querySelector('.task__indicators-box');
    const $descriptionIndicator = $task.querySelector('.task__description-indicator');
    const $subtasksIndicator = $task.querySelector('.task__subtasks-indicator');
    const $subtasksProgress = $task.querySelector('.task__subtasks-progress');

    const descriptionExists = !!task.description;
    const subtasksExist = !!task.subtaskIds.length;

    $indicatorBox.hidden = !descriptionExists && !subtasksExist;
    $descriptionIndicator.hidden = !descriptionExists
    $subtasksIndicator.hidden = !subtasksExist

    const doneNumber = task.subtaskIds.reduce((acc, subtaskId) => {
      return tasksStore[subtaskId].completed ? acc + 1 : acc;
    }, 0);

    $subtasksProgress.textContent = `${task.subtaskIds.length}/${doneNumber}`;

    $task.dataset.id = id;
    $checkbox.checked = task.completed;
    $title.textContent = task.title;
  }
}