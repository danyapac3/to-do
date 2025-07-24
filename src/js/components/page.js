import Component from '/js/lib/component';
import Sidebar from '/js/components/sidebar';
import Board from '/js/components/board';

export default class Page extends Component {
  constructor({parent, element}) {
    super({
      parent,
      element,
    })
  }

  render() {
    const sidebar = new Sidebar({ parent: this });
    const board = new Board({ parent: this, props: {id: null} });

    sidebar.on('changeProject', ({id}) => {
      board.changeProject(id);
    });

    this.element.appendChild(sidebar.element);
    this.element.appendChild(board.element);
  }
}