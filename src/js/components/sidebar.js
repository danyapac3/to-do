import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
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
    super({
      store,
      parent,
      element: htmlToNode(template),
      subscriptions: ['addProject'],
    });
  }

  render() {
    const sidebar = this.element;
    const sidebarSectionContent = sidebar.querySelector('.sidebar__section-content');
    const toggleVisibilityButton = this.element.querySelector('.sidebar__toggle-visibility-button');

    toggleVisibilityButton.addEventListener('click', () => {
      this.element.classList.toggle('collapsed');
    });

    const projectElements = this.store.state.projects
      .map(project => {
        const elm = createProject(project);
        elm.addEventListener('click', () => {
          this.store.dispatch('setCurrentProjectId', {id: project.id});
        });
        elm.addEventListener('dragenter', (e) => {
          elm.classList.add('drag-over'); 
        });
        elm.addEventListener('dragleave', (e) => {
          elm.classList.remove('drag-over'); 
        });        
        elm.addEventListener('dragover', (e) => {
          e.preventDefault();
        });
        elm.addEventListener('drop', (e) => {
          elm.classList.remove('drag-over'); 
          let data;
          
          try {
            data = JSON.parse(e.dataTransfer.getData('Text'));
          } catch (e) {
            return;
          }

          const sourceProject = this.store.state.projects.find(p => p.listIds.includes(data.id));

          if (data.type === 'list') {
            this.store.dispatch('moveListOutside', {
              sourceId: sourceProject.id,
              destinationId: project.id,
              listId: data.id,
            });
          }
        });
        return elm;
      });

    if(this.store.state.projects) {
      sidebarSectionContent.replaceChildren(...projectElements);
    }
  }
}