import defineStore from "/js/lib/store";
import useTasksStore from "./tasksStore";
import storage from '/js/lib/storage';
import {filterObject} from '/js/lib/utils/common';
import { v4 as uuid } from 'uuid';

// const hasParent = (entity) => !!stateByType[entity.parentType][entity.parentId];

// const removeParentlessEntities = (state) => {
//   for (const [key, entity] of Object.entries(state)) {
//     if (hasParent(entity)) continue;
//     delete state[key];
//   }
// };


const storageKey = 'listsStore';
const projectsStorageKey = 'projectsStore';
const tasksStorageKey = 'tasksStore';

const isCorrectId = (entityId, state) => !!state[entityId];

const useListsStore = defineStore({
  initState: () => {
    const fallbackState = {};
    
    let state = storage.load(storageKey);
    const tasksState = storage.load(tasksStorageKey);
    const projectsState = storage.load(projectsStorageKey);

    if (!state || !projectsState) return fallbackState;

    state = filterObject(state, (_, list) => {
      return !!projectsState[list.parentId];
    });

    Object.values(state).forEach(list => {
      list.taskIds = tasksState 
        ? list.taskIds.filter(taskId => isCorrectId(taskId, tasksState))
        : []
    });

    return state || fallbackState;
  },

  onAction: ({state}) => {
    storage.save(storageKey, state);
  },

  actions: {
    addList(title, parent) {
      const id = uuid();
      const list = {
        title: title,
        type: "list",
        id: id,
        taskIds: [],
        parentId: parent?.id || null,
        parentType: parent?.type || null,
      };
      this[id] = list;
      return list;
    },

    renameList(id, title) {
      this[id].title = title;
    },

    addTask(id, title) {
      const list = this[id];
      const task = useTasksStore().addTask(title, list);
      list.taskIds.push(task.id);
    },

    removeTask(listId, taskId) {
      const list = this[listId];
      list.taskIds.splice(list.taskIds.indexOf(taskId), 1);
    },

    insertTask(listId, taskId, index) {
      const list = this[listId];
      list.taskIds.splice(index, 0, taskId);
      useTasksStore().setParent(taskId, list);
    },

    moveTask(listId, oldIndex, newIndex) {
      const list = this[listId];
      const [taskId] = list.taskIds.splice(oldIndex, 1);
      list.taskIds.splice(newIndex, 0, taskId);
    },

    moveTaskToList(oldListId, newListId, oldIndex, newIndex) {
      const oldList = this[oldListId];
      const newList = this[newListId];
      const [taskId] = oldList.taskIds.splice(oldIndex, 1);
      newList.taskIds.splice(newIndex, 0, taskId);
      useTasksStore().setParent(taskId, newList);
    },

    removeList(id) {
      const list = this[id];
      list.taskIds.forEach(taskId => {
        useTasksStore().removeTask(taskId);
      });
      delete this[id];
      return list; 
    },

    setParent(id, parent) {
      this[id].parentType = parent.type;
      this[id].parentId = parent.id;
    }
  },
});

const tasksStore = useTasksStore();
const listsStore = useListsStore();
tasksStore.$onAction(({name, store, returnValue: task}) => {
  if (name === 'removeTask') {
    delete listsStore.$state[task.id];
    listsStore.removeTask(task.parentId, task.id);
  }
}, true);

export default useListsStore;