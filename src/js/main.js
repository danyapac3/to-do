import "/styles/index.scss";

import storage from '/js/lib/storage';
import Page from '/js/components/page';
import Sortable, { AutoScroll } from 'sortablejs/modular/sortable.core.esm';

const sanitizeStorage = (storage) => {
  const tasksStorageKey = 'tasksStore';
  const listsStorageKey = 'listsStore';
  const projectsStorageKey = 'projectsStore';

  const tasksState = storage.load(tasksStorageKey);
  const listsState = storage.load(listsStorageKey);
  const projectsState = storage.load(projectsStorageKey);
  const states = [ 
    { state: tasksState    , storageKey: tasksStorageKey },
    { state: listsState    , storageKey: listsStorageKey },
    { state: projectsState , storageKey: projectsStorageKey },
  ];



  const isEmpty = (obj) => !Object.keys(obj).length;

  
  const isCorrectId = (entityId, state) => !!state[entityId];
  
  const filterCorrectIds = (entityIds, type) => {
    const state = stateByType[type];
    return state 
    ? entityIds.filter(entityId => isCorrectId(entityId, state))
    : [];
  };

  const stateByType = {
    'task' : tasksState,
    'list' : listsState,
    'project' : projectsState,
  }

  const hasParent = (entity) => !!stateByType[entity.parentType][entity.parentId];
  
  const removeParentlessEntities = (state) => {
    for (const [key, entity] of Object.entries(state)) {
      if (hasParent(entity)) continue;
      delete state[key];
    }
  };

  if (!projectsState) {
    storage.remove(tasksStorageKey);
    storage.remove(listsStorageKey);
    storage.remove(projectsStorageKey);
    return;
  }
  
  if (listsState) removeParentlessEntities(listsState);
  if (tasksState) removeParentlessEntities(tasksState);

  if (projectsState) {
    Object.values(projectsState).forEach((project) => {
      project.taskIds = filterCorrectIds(project.taskIds, 'task');
      project.listIds = filterCorrectIds(project.listIds, 'list');
    });
  }

  if (listsState) {
    Object.values(listsState).forEach((list) => {
      list.taskIds = filterCorrectIds(list.taskIds, 'task');
    });
  }

  if (tasksState) {
    Object.values(tasksState).forEach((task) => {
      task.taskIds = filterCorrectIds(task.taskIds, 'task');
    });
  }
};


Sortable.mount( new AutoScroll );
const pageElement = document.querySelector('.page');
const page = new Page({element: pageElement, parent: null});