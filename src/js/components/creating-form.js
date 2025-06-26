import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './list.html';

export default class List extends Component {
  constructor ({id, parent, onSave, title}) {
    super({
      parent,
      element: htmlToNode(template),
      subscriptions: [],
    });

    this.init();
  }

  render() {

    const CreateButton = this.element.querySelector('.list__add-task-button');
    const form = this.element.querySelector('.list__form');
    const formField = this.element.querySelector('.list__form-field');
    const formSaveButton = this.element.querySelector('.list__form-save-button');
    const formCancelButton = this.element.querySelector('.list__form-cancel-button');


    addTaskButton.addEventListener('click', (e) => {
      hide(addTaskButton);
      show(form);
      formField.focus();
    });

    formField.addEventListener('input', ({currentTarget}) => {
      if (formField.innerHTML === '<br>') {
        formField.innerHTML = '';
        return;
      }
    });
    
    const addTaskHandler = ({currentTarget: formField}) => {
      const trimmedText = formField.textContent.trim();
      if (trimmedText)
        this.store.dispatch('addTask', {listId: this.id ,title: trimmedText});

      hide(form);
      show(addTaskButton);
      formField.textContent = '';
    }

    formField.addEventListener('blur', (e) => {
      if (document.activeElement === formField) {
        return
      }
      if (e.relatedTarget === listElement) {
        formField.focus();
        return;
      }
      if (e.relatedTarget === formCancelButton) {
        formField.textContent = '';
        hide(form);
        show(addTaskButton);
        return;
      }
      addTaskHandler(e);
    });

    formSaveButton.addEventListener('click', addTaskHandler);

    hide(form);
    hide(body);

    if (list) {
      ListTitle.textContent = list.title;
    }

    const tasks = this.store.state.tasks.filter(t => t.listId === this.id);
    if (tasks.length) { show(body); }
    tasks.forEach(task => {
      const taskElement = new Task({id: task.id, parent: this}).element;
      body.appendChild(taskElement);
    });
  }
}