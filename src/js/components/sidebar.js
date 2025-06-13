import Component from '/js/lib/component';
import store from '/js/store/index.js';
import {htmlToNode} from '/js/utils';

import template from './sidebar.html';


const renderProject = (project) => {
  return `<div class="sidebar__project user-created">${project.title}</div>`
}

export default class Sidebar extends Component {
  #isHidden = false;

  constructor(onSelectProject = () => {}) {
    super({
      store,
      element: htmlToNode(template),
    });
  }

  render() {
    const sidebar = this.element;
    const sidebarSectionContent = sidebar.querySelector('.sidebar__section-content');
    const toggleVisibilityButton = this.element.querySelector('.sidebar__toggle-visibility-button');

    toggleVisibilityButton.addEventListener('click', (e) => {
      this.element.classList.toggle('hidden');
    });

    if(store.state.projects) {
      sidebarSectionContent.innerHTML = 
        store.state.projects?.map(project => renderProject(project)).join('');
    }
  }
}