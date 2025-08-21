import defineStore from "/js/lib/store";
import storage from "/js/lib/storage";
import useListsStore from "./listsStore";
import { v4 as uuid } from 'uuid';

const listsStore = useListsStore();
const inboxId = 'system.inbox';
const storageKey = "projectsStore";
const tasksStorageKey = 'tasksStore';
const listsStorageKey = 'listsStore';

const isCorrectId = (entityId, state) => !!state[entityId];

const useProjectsStore = defineStore({
  initState: () => {
    const fallbackState = {
      [inboxId]: {
        taskIds: [],
        listIds: [],
        id: inboxId,
        title: "Inbox",
        type: "project",
        hue: 1,
        createdBy: "system",
      }
    };

    const state = storage.load(storageKey);
    const tasksState = storage.load(tasksStorageKey);
    const listsState = storage.load(listsStorageKey);

    if (!state) return fallbackState;

    Object.values(state).forEach(project => {
      project.taskIds = tasksState 
        ? project.taskIds.filter(taskId => isCorrectId(taskId, tasksState))
        : []
      project.listIds = listsState 
        ? project.listIds.filter(listId => isCorrectId(listId, listsState))
        : []
    });


    if (state && inboxId in state) {
      return state;
    }

    return fallbackState;
  },

  onAction: ({state}) => {
    storage.save(storageKey, state);
  },

  actions: {
    addProject(title) {
      const id = uuid();
      const project = {
        title: title || '',
        id,
        type: 'project',
        listIds: [],
        taskIds: [],
        hue: Math.floor(Math.random() * 360),
        createdBy: 'user',
      }

      this[id] = project;

      return project;
    },

    renameProject(id, title) {
      const project = this[id];
      project.title = title;
    },

    removeProject(projectId) {
      const project = this[projectId];
      project.listIds.forEach(listId => {
        delete listsStore.$state
      });
      delete this[projectId];
      return project;
    },

    addList(projectId, title) {
      const project = this[projectId];
      const list = listsStore.addList(title, project);

      project.listIds.push(list.id);
    },

    removeList(projectId, listId) {
      const project = this[projectId];
      project.listIds.splice(project.listIds.indexOf(listId), 1);
    },

    insertList(projectId, listId, index = 0) {
      const project = this[projectId];
      project.listIds.splice(index, 0, listId);
      useListsStore().setParent(listId, project);
    },

    moveList(projectId, indexFrom, indexTo) {
      const project = this[projectId];
      const listId = project.listIds[indexFrom];
      project.listIds.splice(indexFrom, 1);
      project.listIds.splice(indexTo, 0, listId);
    },

    setHue(id, hue) {
      this[id].hue = hue;
    }
  },
});

const projectsStore = useProjectsStore();
listsStore.$onAction(({name, store, returnValue: list}) => {
  if (name === 'removeList') {
    projectsStore.removeList(list.parentId, list.id);
  }
});

export default useProjectsStore;