import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import DatePicker from '/js/components/date-picker';
import useTasksStore from '/js/stores/tasksStore';

import { format } from 'date-fns';


import template from './due-date-selector.html';

const tasksStore = useTasksStore();
const dateFormat = "d.MM.yyyy";

export default class DueDateSelector extends Component {
  constructor({parent, props}) {
    super({
      props,
      parent,
      element: htmlToNode(template),
      stores: [tasksStore],
    });
  }

  renderPredicate({name}) {
    return name === 'setDueDate' || name === 'clearDueDate';
  }

  init({id}) {
    const $selector = this.element;
    const $clearButton = this.element.querySelector('.mini-selector__clear-button');

    
    $selector.onclick = ({pageX, pageY}) => {
      const {left, bottom} = $selector.getBoundingClientRect();
      const datePicker = new DatePicker({props: {
        x: left,
        y: bottom + 10,
        hasTimepicker: true,
        isTodayShown: true,
        isTomorrowShown: true,
      }});

      datePicker.on('submit', (date) => {
        console.log(date);
      });
    };
  }

  render({id}) {
    const $selectedOption = this.element.querySelector('.mini-selector__selected-option');
    const task = tasksStore[id];

    if (task.dueDate) {
      const date = new Date(task.dueDate);
      const formatedDate = format(date, dateFormat);
      $selectedOption.textContent = formatedDate;
      return;
    }

    $selectedOption.textContent = "";
  }
}