import Component from '/js/lib/component';
import {htmlToNode} from '/js/utils/dom';
import template from './sidebar.html';


const createProject = (project) => {
  const element = document.createElement('div');
  element.classList.add('sidebar__project', 'user-created');
  element.dataset.id = project.id;
  element.textContent = project.title;
  return element;
}

export default class Sidebar extends Component {
  constructor({store, parent}) {
    console.log('hello');
    super({
      store,
      parent,
      element: htmlToNode(template),
      subscriptions: ['addProject'],
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

    const projectElements = this.store.state.projects
      .map(project => {
        const elm = createProject(project);
        elm.addEventListener('click', () => {
          this.store.dispatch('setCurrentProjectId', {id: project.id});
        });
        return elm;
      });

    if(this.store.state.projects) {
      sidebarSectionContent.replaceChildren(...projectElements); 
    }
  }
}