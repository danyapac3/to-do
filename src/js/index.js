import "@styles/index.scss";

import {createSidebar} from '@js/components/sidebar.js';

const state = {
  projects: [
    {name: 'create todo project'},
    {name: 'walk the dog'},
    {name: 'date girlfriend'},
  ],
  sections: {

  },
  tasks: {

  }
}

const page = document.querySelector('.page');
const sidebar = createSidebar(state);
sidebar.classList.add('page__sidebar');

page.appendChild(sidebar);