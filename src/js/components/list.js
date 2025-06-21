import Component from '/js/lib/component';
import {htmlToNode} from '/js/utils/dom';
import template from './list.html';

export default class List extends Component {
  constructor (listId, parent) {
    super({
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
  }
}