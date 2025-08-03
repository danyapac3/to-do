import Component from '/js/lib/component';
import { htmlToNode } from '/js/lib/utils/dom';
import useTasksStore from '/js/stores/tasksStore';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
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
    const $cancelButton = this.element.querySelector('.mini-selector__cancel-button');
    const $input = this.element.querySelector('.mini-selector__invisible-input');

    $cancelButton.addEventListener('click', (e) => {
      this.datePicker.clear({ silent: true });
      tasksStore.clearDueDate(id);
      e.stopPropagation();
    }, true);

    $selector.addEventListener('click', (e) => {
      $input.focus();
    });

    this.datePicker = new AirDatepicker($input, {
      position: "bottom left",
      inline: false,
      locale: localeEn,
      dateFormat: dateFormat,
      onSelect: ({date}) => {
        if (date) tasksStore.setDueDate(id, date.toISOString());
        else tasksStore.clearDueDate(id);
      }
    });
  }

  render({id}) {
    const $selectedOption = this.element.querySelector('.mini-selector__selected-option');
    const task = tasksStore[id];

    if (task.dueDate) {
      const date = new Date(task.dueDate);
      const formatedDate = format(date, dateFormat);
      this.datePicker.selectDate(date, { silent: true });
      $selectedOption.textContent = formatedDate;
      return;
    }

    $selectedOption.textContent = "";
  }
}