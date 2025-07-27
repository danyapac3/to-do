import "/styles/index.scss";

import '/js/shared/components';
import Page from '/js/components/page';
import Sortable, { AutoScroll } from 'sortablejs/modular/sortable.core.esm';

Sortable.mount( new AutoScroll );
const pageElement = document.querySelector('.page');
const page = new Page({element: pageElement, parent: null});