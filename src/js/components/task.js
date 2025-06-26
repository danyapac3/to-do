import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './task.html';

export default class Task extends Component {
  constructor({id, parent}) {
    super({
      parent,
      element: htmlToNode(template),
      subscriptions: [],
    });

    this.id = id;

    this.init();
  }

  render() {
    const task = this.store.state.tasks.find(t => t.id === this.id);
    const $task = this.element;
    const $title = $task.querySelector('.task__title');
    const $checkbox = $task.querySelector('.task__checkbox');
    
    if (task.completed) {
      $checkbox.checked = true;
    }
    
    $checkbox.addEventListener('change', () => {
      console.log(this.store);
      this.store.dispatch('setTaskСompleteness', {id: this.id, completed: $checkbox.checked});
    });
    $title.textContent = task.title;
  }
}