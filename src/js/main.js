import "/styles/index.scss";

import '/js/shared/components';
import store from '/js/store/index';
import Page from '/js/components/page';
import Sortable, { AutoScroll } from 'sortablejs/modular/sortable.core.esm';
import useTasksStore from '/js/stores/tasksStore';
import useListsStore from '/js/stores/listsStore';
import useProjectsStore from '/js/stores/projectsStore';

Sortable.mount( new AutoScroll );
const pageElement = document.querySelector('.page');
const page = new Page({element: pageElement, store, parent: null});

const tasksStore = useTasksStore();
const listsStore = useListsStore();

const list = (listsStore.addList('list'));
console.log(list);
// listsStore.addTask(list.id, 'me');

// tasksStore.addTask('hello world');
// console.log(tasksStore);
// console.log(listsStore.$state);