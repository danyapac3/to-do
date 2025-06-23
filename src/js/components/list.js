import Component from '/js/lib/component';
import Task from '/js/components/task.js';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './list.html';

const hide = (elem) => elem.classList.toggle('hidden', true);
const show = (elem) => elem.classList.toggle('hidden', false);

export default class List extends Component {
  constructor ({id, parent, store}) {
    super({
      store,
      parent,
      element: htmlToNode(template),
      subscriptions: ['addTask'],
    });
    
    this.id = id;

    this.init();
  }

  render() {
    
    const listElement = this.element;
    const body = this.element.querySelector('.list__body');
    const ListTitle = listElement.querySelector('.list__title');
    const list = this.store.state.lists.find(l => l.id === this.id);
    if (list) {
      ListTitle.textContent = list.title;
    }

    const addTaskButton = this.element.querySelector('.list__add-task-button');
    const form = this.element.querySelector('.list__form');
    const formField = this.element.querySelector('.list__form-field');
    const formSaveButton = this.element.querySelector('.list__form-save-button');
    const formCancelButton = this.element.querySelector('.list__form-cancel-button');


    addTaskButton.addEventListener('click', (e) => {
      hide(addTaskButton);
      show(form);
      formField.focus();
    });

    formField.addEventListener('input', () => {
      if (formField.innerHTML === '<br>') {formField.innerHTML = '';}
    });

    formSaveButton.addEventListener('click', () => {
      const trimmedText = formField.textContent.trim();
      if (trimmedText) {
        this.store.dispatch('addTask', {listId: this.id ,title: trimmedText});
        hide(form);
        show(addTaskButton);
      } else {
        formField.focus();
      }
      formField.textContent = '';
    });

    formCancelButton.addEventListener('click', () => {
      formField.textContent = '';
      hide(form);
      show(addTaskButton);
    });

    

    hide(form);
    hide(body);

    const tasks = this.store.state.tasks.filter(t => t.listId === this.id);
    if (tasks.length) { show(body); }
    tasks.forEach(task => {
      const taskElement = new Task({id: task.id, parent: this}).element;
      body.appendChild(taskElement);
    });
  }
}