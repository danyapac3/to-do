import defineStore from "/js/lib/store";
import { v4 as uuid } from 'uuid';
import {filterObject} from '/js/lib/utils/common';
import storage from "/js/lib/storage";

const storageKey = 'tasksStore';
const listsStorageKey = 'listsStore';
const projectsStorageKey = 'projectsStore';

const useTasksStore = defineStore({
  initState: () => {
    const fallbackState = {};

    let state = storage.load(storageKey);
    const listsState = storage.load(listsStorageKey);
    const projectsState = storage.load(projectsStorageKey);

    if (!state || !projectsState) return fallbackState;

    state = filterObject(state, (_, task) => {
      const parentState = {
        'task': state,
        'list': listsState,
        'project': projectsState,
      }[task.parentType];

      return (!!parentState && task.parentId in parentState);
    });

    Object.values(state).forEach(task => {
      task.taskIds = task.taskIds.filter(t => (t.id in state));
    });

    return state;
  },

  onAction: ({state}) => {
    storage.save(storageKey, state);
  },

  actions: {
    addTask(title, parent) {
      const id = uuid();
      const task = {
        id,
        title: title || "",
        type: "task",
        completed: false,
        priority: 0,
        taskIds: [],
        description: "",
        parentId: parent?.id || null,
        parentType: parent?.type || null,
        dueDate: null,
      };

      this[id] = task

      return task;
    },

    setPriority(id, number) { 
      if (number < 0 || !Number.isInteger(number)) throw new Error('invalid priority');
      const task = this[id];
      task.priority = number;
    },

    setParent(id, parent) {
      const task = this[id];
      task.parentId = parent.id;
      task.parentType = parent.type;
    },
    
    removeTask(id) {
      const task = this[id];
      if (task.parentType === 'task') {
        useTasksStore().removeSubtask(task.parentId, task.id); 
      }
      delete this[id];
      return task;
    },

    renameTask(id, title) {
      this[id].title = title;
    },

    addSubtask(id, title) {
      const task = this[id];
      const subtask = useTasksStore().addTask(title, task);
      task.taskIds.push(subtask.id);
    },

    removeSubtask(id, index) {
      const task = this[id];
      const subtaskId = task.taskIds[index];
      task.taskIds.splice(index, 1);
    },

    moveSubtask(parentTaskId, oldIndex, newIndex) {
      const task = this[parentTaskId];
      const [subtaskId] = task.taskIds.splice(oldIndex, 1);
      task.taskIds.splice(newIndex, 0, subtaskId);
    },

    toggleCompleted(id) {
      const task = this[id]; 
      task.completed = !task.completed;
      return task;
    },
    
    setDescription(id, description) {
      this[id].description = description;
    },

    setDueDate(id, timestamp) {
      const task = this[id];
      task.dueDate = timestamp;
    },

    clearDueDate(id) {
      const task = this[id];
      task.dueDate = null;
    }
  },
});

export default useTasksStore;