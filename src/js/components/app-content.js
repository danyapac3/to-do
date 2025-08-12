import Component from '/js/lib/component';
import ProjectBoard from '/js/components/project-board';
import TodayBoard from '/js/components/today-board';
import useAppStore from '/js/stores/appStore';
import { htmlToNode } from '/js/lib/utils/dom';
import template from './app-content.html';


const appStore = useAppStore(); 

export default class AppContent extends Component {
  constructor({parent}) {
    super({
      parent,
      element: htmlToNode(template),
      stores: [useAppStore()],
    })
  }

  render() {
    const $appContent = this.element;
        
    const setBoard = (board) => {
      $appContent.appendChild(board.element);
    }
    
    if (appStore.currentProject === 'system.today') {
      setBoard(new TodayBoard({parent: this}));
    } else {
      setBoard(new ProjectBoard({parent: this, props: {id: appStore.currentProject}}));
    }
  }
}