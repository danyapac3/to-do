import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './task.html';

export default class Task extends Component {
  constructor({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
      subscriptions: [],
    });
  }

  render({id}) {
    const task = this.store.state.tasks.find(t => t.id === id);
    const $task = this.element;
    const $title = $task.querySelector('.task__title');
    const $checkbox = $task.querySelector('.task__checkbox');

    $task.dataset.id = id;
    
    if (task.completed) {
      $checkbox.checked = true;
    }
    
    $checkbox.addEventListener('change', () => {
      this.store.dispatch('setTaskСompleteness', {id, completed: $checkbox.checked});
    });
    $title.textContent = task.title;
  }
}