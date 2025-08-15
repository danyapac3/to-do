import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import useTasksStore from '/js/stores/tasksStore';
import ActionMenu from '/js/components/action-menu';

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
    const $clearButton = this.element.querySelector('.mini-selector__clear-button');

    $clearButton.addEventListener('click', (e) => {
      tasksStore.setPriority(id, 0);
      e.stopPropagation();
    }, true);

    $selector.addEventListener('click', () => {
      const {bottom, left} = $selector.getBoundingClientRect();
      new ActionMenu({
        props: {
          items: [
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
          ],
          x: left,
          y: bottom + 10,
          title: 'Priority'
        }
      });
    });
  }

  render({id}) {
    const $selectedOption = this.element.querySelector('.mini-selector__selected-option');
    const task = tasksStore[id];

    $selectedOption.textContent = (['', 'Low', 'Normal', 'High'])[task.priority];
  }
}