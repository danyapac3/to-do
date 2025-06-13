import "@styles/index.scss";

import Sidebar from '@js/components/sidebar.js';



const sidebar = new Sidebar();
const page = document.querySelector('.page');

sidebar.render();

page.appendChild(sidebar.element);