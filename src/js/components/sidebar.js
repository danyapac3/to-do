import editIcon from '/images/icons/edit.svg';
import removeIcon from '/images/icons/bin.svg';

import Component from '/js/lib/component';
import AddItemForm from '/js/components/add-item';
import ActionMenu from '/js/components/action-menu';

import {htmlToNode} from '/js/lib/utils/dom';
import template from './sidebar.html';
import useProjectsStore from "/js/stores/projectsStore";
import useListsStore from "/js/stores/listsStore";
import useAppStore from "/js/stores/appStore";

const projectsStore = useProjectsStore();
const appStore = useAppStore();

const matchProjectElm = (elm) => {
  return elm.dataset.type === 'project';
}

const setActiveItem = ($sidebarElm) => {
  const $activeItems = $sidebarElm.querySelectorAll('.sidebar__item--active');
  $activeItems.forEach(($item) => {
    $item.classList.remove('sidebar__item--active');
  });
  $sidebarElm.querySelector(`.sidebar__item[data-id="${appStore.currentProject}"]`)?.classList?.add('sidebar__item--active');
}

const createProject = (project) => {
  const template = 
    /*html*/ `
    <div class="sidebar__item sidebar__item--project" data-type="project" data-id="${project.id}">
      <input class="sidebar__item-title" value="${project.title}" disabled>
      <div class="sidebar__item-action-button"></div>
    </div>`;
  const element = htmlToNode(template);
  if (project.hue) element.style.setProperty('--hue', project.hue);

  const $title = element.querySelector('.sidebar__item-title');
  let prevValue = project.title

  const save = () => {
    $title.disabled = true;
    const trimmed = $title.value.trim();
    if (trimmed === "" || trimmed === prevValue) {
      $title.value = prevValue;
      return;
    }
    prevValue = trimmed;
    projectsStore.renameProject(project.id, trimmed);
  };

  $title.onchange = save;
  $title.onblur = save; 
  return element;
}

const showProjectActionMenu = (projectId, x, y, $sidebar) => {
  const actionMenu = new ActionMenu({
    parent: this,
    props: {
      items: [
        {
          title: 'Rename',
          iconSrc: editIcon,
          callback: () => { 
            const $title = $sidebar.querySelector(`.sidebar__item--project[data-id="${projectId}"] .sidebar__item-title`);
            $title.disabled = false;
            $title.focus();
          },
        },
        { 
          title: 'Remove',
          iconSrc: removeIcon,
          callback: () => { 
            projectsStore.removeProject(projectId);
          }
        }
      ], 
      x: x,
      y: y,
      title: 'Actions'
    }
  });
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
    return name === 'setHue' || name === 'addProject' || name === 'removeProject';
  }

  init() {
    const $sidebar = this.element;
    const $todayItem = $sidebar.querySelector('.sidebar__item[data-filtered-for="today"]');
    const $inboxItem = $sidebar.querySelector('.sidebar__item[data-id="system.inbox"]');;

    $todayItem.addEventListener('click', () => {
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

    $sidebar.addEventListener('click', ({target, pageX, pageY}) => {
      if (target.classList.contains('sidebar__item-action-button')) {
        const projectId = target.closest('.sidebar__item').dataset.id;
        showProjectActionMenu(projectId, pageX, pageY, $sidebar);
        return;
      }
      const closest = target.closest('.sidebar__item');
      if (!closest) return;
      if (!matchProjectElm(closest)) return;
      appStore.setCurrentProject(closest.dataset.id);
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

    const projectElements = Object.values(projectsStore.$state)
    .filter(project => project.createdBy === 'user')
    .map(project => createProject(project));
    $sidebarProjectsContent.replaceChildren(...projectElements);
    setActiveItem($sidebar);

    const addProjectForm = new AddItemForm({parent: this, props: {title: "Add New Project"}});
    $sidebarProjectsContent.appendChild(addProjectForm.element);
    addProjectForm.on('save', ({text}) => {
      projectsStore.addProject(text);
    });
  }
}