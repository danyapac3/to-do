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

    const changeBoard = (() => {
      let currentBoard = null;
      return (board) => {
        currentBoard?.destroy();
        currentBoard = board;
        this.element.appendChild(currentBoard.element);
      }
    })()

    sidebar.on('changeProject', ({id}) => {
      changeBoard(new Board({parent: this, props: {id}}));
    });

    this.element.appendChild(sidebar.element);
  }
}