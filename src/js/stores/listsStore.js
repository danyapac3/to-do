import defineStore from "/js/lib/store";
import useTasksStore from "./tasksStore";
import { v4 as uuid } from 'uuid';

const useListsStore = defineStore({
  state: {},
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

    removeList(id) {
      const list = this[id];
      list.taskIds.forEach(taskId => {
        useTasksStore().removeTask(taskId);
      });
      delete this[id];
    },

    changeParent(id, parent) {
      this[id].parentType = parent.type;
      this[id].parentId = parent.id;
    }
  },
});

const tasksStore = useTasksStore();

tasksStore.$onAction(({name, args, store, returnValue: task}) => {
  const listsStore = useListsStore();
  
  if (name !== 'removeTask' || !(task.parentId in listsStore) || task.parentType !== 'list') { return; }
  listsStore.removeTask(task.parentId, task.id);
});

export default useListsStore;