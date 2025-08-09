import Component from '/js/lib/component';
import Sidebar from '/js/components/sidebar';
import AppContent from '/js/components/app-content';

export default class Page extends Component {
  constructor({parent, element}) {
    super({
      parent,
      element,
      stores: [],
    })
  }

  render() {
    const $page = this.element;
    const $sidebarPlace = $page.querySelector('.page__sidebar-place');
    
    const sidebar = new Sidebar({ parent: this });
    $sidebarPlace.appendChild(sidebar.element);

    const appContent = new AppContent({ parent: this });
    appContent.element.classList.add('page__content');
    $page.appendChild(appContent.element); 
  }
}