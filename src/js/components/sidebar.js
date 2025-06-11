import {htmlToNode} from '/js/utils.js';
import template from './sidebar.html';


const createSidebarProject = (project) => {
  return htmlToNode(`<div class="sidebar__project user-created">${project.name}</div>`);
}


export const createSidebar = (state = {}, callbacks = {}) => {
  const sidebar = htmlToNode(template);
  const sidebarSection = sidebar.querySelector('.sidebar__section');
  const toggleVisibilityButton = sidebar.querySelector('.sidebar__toggle-visibility-button');

  toggleVisibilityButton.addEventListener('click', (e) => {
    sidebar.classList.toggle('hidden');
  });

  state.projects?.forEach(project => {
    sidebarSection.appendChild(createSidebarProject(project));
  });

  return sidebar;
};