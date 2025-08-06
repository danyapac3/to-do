import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './sidebar.html';
import useProjectsStore from "/js/stores/projectsStore";
import useListsStore from "/js/stores/listsStore";


const createProject = (project) => {
  const element = document.createElement('div');

  element.classList.add('sidebar__item',  'sidebar__item--project');
  element.dataset.id = project.id;
  if (project.hue) {
    element.style.setProperty('--hue', project.hue);
  }
  element.textContent = project.title;
  return element;
}

export default class Sidebar extends Component {
  constructor({parent}) {
    super({
      parent,
      element: htmlToNode(template),
    });
  }

  init() {
    const $sidebar = this.element;
    $sidebar.addEventListener('click', ({target}) => {
      if (![...target.classList].includes('sidebar__item')) return;
      const item = target;
      $sidebar.querySelectorAll('.sidebar__item--active').forEach(elm => {
        elm.classList.remove('sidebar__item--active');
      });
      item.classList.add('sidebar__item--active');
    }) 
  }

  render() {
    const $sidebar = this.element;
    const $toggleVisibilityButton = this.element.querySelector('.sidebar__toggle-visibility-button');
    const $sidebarProjects = $sidebar.querySelector('.sidebar__section[data-type="projects"]');
    const $sidebarProjectsContent = $sidebarProjects.querySelector('.sidebar__section-content');
    const $todayButton = $sidebar.querySelector('.sidebar__item[data-filtered-for="today"]');

    $todayButton.addEventListener('click', () => {
      this.emit('selectToday');
    });

    $toggleVisibilityButton.addEventListener('click', () => {
      $sidebar.classList.toggle('collapsed');
    });

    const projectsStore = useProjectsStore();
    const projectElements = Object.values(projectsStore.$state)
      .map(project => {
        const elm = createProject(project);
        elm.addEventListener('click', () => {
          this.emit('selectProject', {id: project.id});
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

          if (data.type === 'list') {
            const list = useListsStore().$state[data.id];

            useProjectsStore().moveListToProject(list.id, list.parentId, project.id);
          }
        });
        return elm;
      });

    $sidebarProjectsContent.replaceChildren(...projectElements);
  }
}