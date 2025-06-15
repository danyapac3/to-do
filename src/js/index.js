import "/styles/index.scss";
import store from '/js/store/index'

import Sidebar from '@js/components/sidebar.js';



const sidebar = new Sidebar();
const page = document.querySelector('.page');

sidebar.render();

store.dispatch('addProject', {title: 'hello me'});

sidebar.render();


page.appendChild(sidebar.element);