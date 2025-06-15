import Component from '/js/lib/component';
import store from '/js/store/index.js';
import {htmlToNode} from '/js/utils';
import template from './sidebar.html';


const createProject = (project) => {
  const element = document.createElement('div');
  element.classList.add('sidebar__project', 'user-created');
  element.dataset.id = project.id;
  element.textContent = project.title;
  return element;
}



export default class Sidebar extends Component {
  constructor(onSelectProject = () => {}) {
    super({
      store,
      element: htmlToNode(template),
    });

    this.onSelectProject = onSelectProject;
  }

  #hide = (e) => {
    this.element.classList.toggle('hidden');
  }

  render() {
    const sidebar = this.element;
    const sidebarSectionContent = sidebar.querySelector('.sidebar__section-content');
    const toggleVisibilityButton = this.element.querySelector('.sidebar__toggle-visibility-button');

    toggleVisibilityButton.removeEventListener('click', this.#hide);
    toggleVisibilityButton.addEventListener('click', this.#hide);


    const projectElements = store.state.projects
      .map(project => {
        const elm = createProject(project);
        elm.addEventListener('click', () => this.onSelectProject(project.id));
        return elm;
      });

    if(store.state.projects) {
      sidebarSectionContent.append(...projectElements); 
    }
  }
}