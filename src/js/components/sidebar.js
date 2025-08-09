import Component from '/js/lib/component';
import {htmlToNode} from '/js/lib/utils/dom';
import template from './sidebar.html';
import useProjectsStore from "/js/stores/projectsStore";
import useListsStore from "/js/stores/listsStore";
import useAppStore from "/js/stores/appStore";

const projectsStore = useProjectsStore();
const appStore = useAppStore();

const matchProjectElm = (elm) => elm.classList.contains('sidebar__item--project');

const setActiveItem = ($sidebarElm) => {
  const $activeItems = $sidebarElm.querySelectorAll('.sidebar__item--active');
  $activeItems.forEach(($item) => {
    $item.classList.remove('sidebar__item--active');
  });
  console.log(appStore.currentProject);
  $sidebarElm.querySelector(`.sidebar__item[data-id="${appStore.currentProject}"]`).classList.add('sidebar__item--active');
}

const createProject = (project) => {
  const element = document.createElement('div');
  if (appStore.currentProject === project.id) {
    element.classList.add('sidebar__item--active');
  }
  element.classList.add('sidebar__item',  'sidebar__item--project');
  element.dataset.id = project.id;
  if (project.hue) element.style.setProperty('--hue', project.hue);
  element.textContent = project.title;
  return element;
}


export default class Sidebar extends Component {
  constructor({parent}) {
    super({
      parent,
      element: htmlToNode(template),
      stores: [projectsStore],
    });
  }

  renderPredicate({name}) {
    return name === 'setHue'
  }

  init() {
    const $sidebar = this.element;
    const $todayButton = $sidebar.querySelector('.sidebar__item[data-filtered-for="today"]');

    $todayButton.addEventListener('click', () => {
      appStore.setCurrentProject('system.today');
      setActiveItem($sidebar);
    });

    const $toggleVisibilityButton = this.element.querySelector('.sidebar__toggle-visibility-button');
    $toggleVisibilityButton.addEventListener('click', () => {
      $sidebar.classList.toggle('collapsed');
    });

    $sidebar.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    $sidebar.addEventListener('dragenter', ({target}) => {
      if (!matchProjectElm(target)) return;
      target.classList.add('drag-over');
    });

    $sidebar.addEventListener('click', ({target}) => {
      if (!matchProjectElm(target)) return;
      appStore.setCurrentProject(target.dataset.id);
      setActiveItem($sidebar);
    });

    $sidebar.addEventListener('dragleave', ({target}) => {
      if (!matchProjectElm(target)) return;
      target.classList.remove('drag-over');
    });

    $sidebar.addEventListener('drop', ({target, dataTransfer}) => {
      if (!matchProjectElm(target)) return;
      
      target.classList.remove('drag-over'); 
      
      let data;
      try { data = JSON.parse(dataTransfer.getData('Text')); }
      catch { return }

      if (data.type === 'list') {
        const list = useListsStore().$state[data.id];

        useProjectsStore().moveListToProject(list.id, list.parentId, target.dataset.id);
      }
    });
  }

  render() {
    const $sidebar = this.element;
    const $sidebarProjects = $sidebar.querySelector('.sidebar__section[data-type="projects"]');
    const $sidebarProjectsContent = $sidebarProjects.querySelector('.sidebar__section-content');

    setActiveItem($sidebar);

    const projectElements = Object.values(projectsStore.$state).map(project => {
      const elm = createProject(project);
      return elm;
    });

    $sidebarProjectsContent.replaceChildren(...projectElements);
  }
}