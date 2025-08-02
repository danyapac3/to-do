import Component from '/js/lib/component';
import { contextMenu } from '/js/shared/components';
import { htmlToNode } from '/js/lib/utils/dom';
import useTasksStore from '/js/stores/tasksStore';

import template from './priority-selector.html';


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

  init({id}) {
    const $selector = this.element;
    const $icon = this.element.querySelector('.mini-selector__icon');
    const $title = this.element.querySelector('.mini-selector__title');
    const $selectedOption = this.element.querySelector('.mini-selector__selected-option');
    const $cancelButton = this.element.querySelector('.mini-selector__cancel-button');
    const task = tasksStore[id];

    $cancelButton.addEventListener('click', (e) => {
      tasksStore.setPriority(id, 0);
      e.stopPropagation();
    }, true);

    $selector.addEventListener('click', ({pageX, pageY}) => {
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
        {
          title: "None",
          callback: () => {tasksStore.setPriority(id, 0)}
        },
      ], left, bottom + 10, 'Priority');
    });
  }

  render({title, id}) {
    const $selector = this.element;
    const $icon = this.element.querySelector('.mini-selector__icon');
    const $title = this.element.querySelector('.mini-selector__title');
    const $selectedOption = this.element.querySelector('.mini-selector__selected-option');
    const $cancelButton = this.element.querySelector('.mini-selector__cancel-button');
    const task = tasksStore[id];

    $selectedOption.textContent = (['', 'Low', 'Normal', 'High'])[task.priority];
  }
}