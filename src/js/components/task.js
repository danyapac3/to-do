import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './task.html';

export default class Task extends Component {
  constructor({id, parent}) {
    super({
      parent,
      element: htmlToNode(template),
    });

    this.id = id;

    this.init();
  }

  render() {
    const task = this.store.state.tasks.find(t => t.id === this.id);
    const title = this.element.querySelector('.task__title');
    title.textContent = task.title;
  }
}