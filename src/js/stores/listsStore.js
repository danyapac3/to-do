import defineStore from "/js/lib/store";
import useTasksStore from "./tasksStore";
import { v4 as uuid } from 'uuid';

const useListsStore = defineStore({
  state: {
    l1: { id: "l1", title: "UI Tasks", type: "list", taskIds: ["t1"], parentId: "p1", parentType: "project" },
    l2: { id: "l2", title: "Backend Tasks", type: "list", taskIds: ["t2"], parentId: "p1", parentType: "project" },
    l3: { id: "l3", title: "Email Strategy", type: "list", taskIds: ["t3"], parentId: "p2", parentType: "project" },
    l4: { id: "l4", title: "Social Media", type: "list", taskIds: ["t4"], parentId: "p2", parentType: "project" },
    l5: { id: "l5", title: "Fitness", type: "list", taskIds: ["t5"], parentId: "p3", parentType: "project" },
    l6: { id: "l6", title: "Reading List", type: "list", taskIds: ["t6"], parentId: "p3", parentType: "project" },
    l7: { id: "l7", title: "Packing List", type: "list", taskIds: ["t7"], parentId: "p4", parentType: "project" },
    l8: { id: "l8", title: "Destinations", type: "list", taskIds: ["t8"], parentId: "p4", parentType: "project" },
    l9: { id: "l9", title: "JavaScript", type: "list", taskIds: ["t9"], parentId: "p5", parentType: "project" },
    l10: { id: "l10", title: "English", type: "list", taskIds: ["t10"], parentId: "p5", parentType: "project" },
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