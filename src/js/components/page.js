import Component from '/js/lib/component';
import Sidebar from '/js/components/sidebar';
import Board from '/js/components/board';

export default class Page extends Component {
  constructor({store, parent, element}) {
    super({
      store,
      parent,
      element,
      subscriptions: [],
    })
  }

  render() {
    const sidebar = new Sidebar({store: this.store, parent: this});
    const board = new Board({store: this.store, parent: this});

    this.element.appendChild(sidebar.element);
    this.element.appendChild(board.element);

  }
}