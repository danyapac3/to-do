import "/styles/index.scss";

import '/js/shared/components';
import store from '/js/store/index';
import Page from '/js/components/page';
import Sortable, { AutoScroll } from 'sortablejs/modular/sortable.core.esm.js';

Sortable.mount( new AutoScroll );
const pageElement = document.querySelector('.page');
const page = new Page({element: pageElement, store, parent: null});