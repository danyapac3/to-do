import Component from '/js/lib/component';
import Task from '/js/components/task';
import AddItemForm from '/js/components/add-item';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './list.html';

const hide = (elem) => elem.classList.toggle('hidden', true);
const show = (elem) => elem.classList.toggle('hidden', false);

export default class List extends Component {
  constructor ({parent, store, props}) {
    super({
      props,
      store,
      parent,
      element: htmlToNode(template),
      subscriptions: ['addTask'],
    });
  }

  render({id}) {
    const listElement = this.element;
    const body = this.element.querySelector('.list__body');
    const footer = this.element.querySelector('.list__footer');
    const ListTitle = listElement.querySelector('.list__title');
    const list = this.store.state.lists.find(l => l.id === id);

    hide(body);

    if (list) {
      ListTitle.textContent = list.title;
    }

    const tasks = this.store.state.tasks.filter(t => t.listId === id);
    if (tasks.length) { show(body); }
    tasks.forEach(task => {
      const taskElement = new Task({
        parent: this,
        props: {id: task.id}
      }).element;
      body.appendChild(taskElement);
    });

    const newTaskForm = new AddItemForm({
      parent: this,
      props: {title: 'Add new task'}
    });
    newTaskForm.on('save', ({text}) => {
      this.store.dispatch('addTask', {listId: id ,title: text});
    });
    footer.appendChild(newTaskForm.element);
  }
}