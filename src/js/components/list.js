import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './list.html';

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

    addTaskButton.addEventListener('click', (e) => {
      addTaskButton.style.display = 'none';
      form.style.display = 'block';
    });

    form.style.display = 'none';
  }
}