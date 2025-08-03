import Component from '/js/lib/component';
import { contextMenu } from '/js/shared/components';
import { htmlToNode } from '/js/lib/utils/dom';
import useTasksStore from '/js/stores/tasksStore';

import template from './priority-selector.html';


const tasksStore = useTasksStore();

export default class PrioritySelector extends Component {
  constructor({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
      stores: [tasksStore],
    });
  }

  renderPredicate({name}) {
    return (name === "setPriority");
  }

  init({id}) {
    const $selector = this.element;
    const $cancelButton = this.element.querySelector('.mini-selector__cancel-button');

    $cancelButton.addEventListener('click', (e) => {
      tasksStore.setPriority(id, 0);
      e.stopPropagation();
    }, true);

    $selector.addEventListener('click', () => {
      const {bottom, left} = $selector.getBoundingClientRect();
      contextMenu.showWithItems([
        {
          title: "High",
          callback: () => {tasksStore.setPriority(id, 3)}
        },
        {
          title: "Medium",
          callback: () => {tasksStore.setPriority(id, 2)}
        },
        {
          title: "Low",
          callback: () => {tasksStore.setPriority(id, 1)}
        },
      ], left, bottom + 10, 'Priority');
    });
  }

  render({id}) {
    const $selectedOption = this.element.querySelector('.mini-selector__selected-option');
    const task = tasksStore[id];

    $selectedOption.textContent = (['', 'Low', 'Normal', 'High'])[task.priority];
  }
}