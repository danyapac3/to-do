import "/styles/index.scss";
import store from '/js/store/index'

import Sidebar from '@js/components/sidebar.js';


const page = document.querySelector('.page');
const sidebar = new Sidebar((projectId) => {
  console.log(projectId)
});


sidebar.render();

page.appendChild(sidebar.element);