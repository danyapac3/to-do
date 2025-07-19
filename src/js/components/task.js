import Component from '/js/lib/component';
import { contextMenu, taskModal } from '/js/shared/components';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './task.html';

export default class Task extends Component {
  constructor({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
      subscriptions: ['toggleTaskСompleteness'],
    });
  }

  init({id}) {
    const $task = this.element;
    const $title = $task.querySelector('.task__title');
    const $checkbox = $task.querySelector('.task__checkbox');

    $checkbox.addEventListener('change', () => {
      this.store.dispatch('toggleTaskСompleteness', {id});
    });

    $title.addEventListener('click', () => {
      taskModal.showWithTask(id);
    });
  }

  render({id}) {
    const task = this.store.state.tasks.find(t => t.id === id);
    const $task = this.element;
    const $title = $task.querySelector('.task__title');
    const $checkbox = $task.querySelector('.task__checkbox');
    
    $task.dataset.id = id;
    
    $checkbox.checked = task.completed;

    $title.textContent = task.title;
  }
}