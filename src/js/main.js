import "/styles/index.scss";
import store from '/js/store/index'

import Sidebar from '@js/components/sidebar.js';



const sidebar = new Sidebar((projectId) => {
  console.log(projectId)
});
const page = document.querySelector('.page');

sidebar.render();

page.appendChild(sidebar.element);