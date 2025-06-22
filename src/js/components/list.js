import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './list.html';

const hide = (elem) => elem.classList.toggle('hidden', true);
const show = (elem) => elem.classList.toggle('hidden', false);

export default class List extends Component {
  constructor ({listId, parent, store}) {
    super({
      store,
      parent,
      element: htmlToNode(template),
    });
    
    this.listId = listId;

    this.init();
  }

  render() {
    
    const listElement = this.element;
    const ListTitle = listElement.querySelector('.list__title');
    const list = this.store.state.lists.find(s => s.id === this.listId);
    if (list) {
      ListTitle.textContent = list.title;
    }

    const addTaskButton = this.element.querySelector('.list__add-task-button');
    const form = this.element.querySelector('.list__form');
    const formField = this.element.querySelector('.list__form-field');
    const formSaveButton = this.element.querySelector('.list__form-save-button');
    const formCancelButton = this.element.querySelector('.list__form-cancel-button');

    const createTask = (title) => {console.log(`created with title:${title}`)};

    addTaskButton.addEventListener('click', (e) => {
      hide(addTaskButton);
      show(form);
      formField.focus();
    });

    formSaveButton.addEventListener('click', () => {
      const trimmedText = formField.value.trim();
      if (trimmedText) {
        createTask(trimmedText);
        hide(form);
        show(addTaskButton);
      } else {
        formField.focus();
      }
      formField.value = '';
    });

    formCancelButton.addEventListener('click', () => {
      formField.value = '';
      hide(form);
      show(addTaskButton);
    });

    hide(form)
  }
}