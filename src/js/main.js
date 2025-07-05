import "/styles/index.scss";

import store from '/js/store/index';
import Page from '/js/components/page';


const pageElement = document.querySelector('.page');
const page = new Page({element: pageElement, store, parent: null});