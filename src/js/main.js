import "/styles/index.scss";

import defineStore from "/js/lib/store";
import '/js/shared/components';
import store from '/js/store/index';
import Page from '/js/components/page';
import Sortable, { AutoScroll } from 'sortablejs/modular/sortable.core.esm.js';

Sortable.mount( new AutoScroll );
const pageElement = document.querySelector('.page');
const page = new Page({element: pageElement, store, parent: null});

const useStore = defineStore({
  state: {
    counter: 0,
  },

  actions: {
    increaseCounter() {
      this.counter++ 
    },
  }
});

const myStore = useStore();
myStore.$onAction((name, store) => {console.log(store.counter, name)})
myStore.increaseCounter();