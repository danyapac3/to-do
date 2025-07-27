import Component from '/js/lib/component';
import { contextMenu, taskModal } from '/js/shared/components';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './task.html';
import useTasksStore from '/js/stores/tasksStore';

export default class Task extends Component {
  constructor({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
      stores: [useTasksStore()],
    });
  }

  renderPredicate({name, args}) {
    if (name === 'addTask' || name === 'removeTask') return false;
    if (args[0] === this.props.id) return true;
  }

  init({id}) {
    const $task = this.element;
    const $title = $task.querySelector('.task__title');
    const $checkbox = $task.querySelector('.task__checkbox');

    $checkbox.addEventListener('click', () => {
      useTasksStore().toggleCompleted(id);
    });

    $title.addEventListener('click', () => {
      taskModal.showWithTask(id);
    });
  }

  render({id}) {
    const task = useTasksStore()[id];
    const $task = this.element;
    const $title = $task.querySelector('.task__title');
    const $checkbox = $task.querySelector('.task__checkbox');
    
    $task.dataset.id = id;
    
    $checkbox.checked = task.completed;

    $title.textContent = task.title;
  }
}