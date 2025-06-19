import Component from '/js/lib/component';
import {htmlToNode} from '/js/utils/dom';
import store from '/js/store/index';
import template from './sidebar.html';


const createProject = (project) => {
  const element = document.createElement('div');
  element.classList.add('sidebar__project', 'user-created');
  element.dataset.id = project.id;
  element.textContent = project.title;
  return element;
}


export default class Sidebar extends Component {
  constructor(handlers) {
    super({
      store,
      element: htmlToNode(template),
      subscriptions: ['addProject']
    });

    this.init();
  }

  render() {
    const sidebar = this.element;
    const sidebarSectionContent = sidebar.querySelector('.sidebar__section-content');
    const toggleVisibilityButton = this.element.querySelector('.sidebar__toggle-visibility-button');

    toggleVisibilityButton.addEventListener('click', () => {
      this.element.classList.toggle('hidden');
    });

    const projectElements = store.state.projects
      .map(project => {
        const elm = createProject(project);
        elm.addEventListener('click', () => {
          store.dispatch('setCurrentProjectId', {id: project.id});
        });
        return elm;
      });

    if(store.state.projects) {
      sidebarSectionContent.replaceChildren(...projectElements); 
    }
  }
}