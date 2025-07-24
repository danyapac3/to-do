import defineStore from "/js/lib/store";
import { v4 as uuid } from 'uuid';

const createTask = (title, id) => ({
  title: title || "",
  type: "task",
  id: id,
  completed: false,
  subtaskIds: [],
  description: "",
  parentId: null,
  parentType: null,
  dueDate: null,
});

export default defineStore({
  state: {},
  actions: {
    addTask(title, parent) {
      const id = uuid();
      const task = {
        id,
        title: title || "",
        type: "task",
        completed: false,
        subtaskIds: [],
        description: "",
        parentId: parent?.id || null,
        parentType: parent?.type || null,
        dueDate: null,
      };

      this[id] = task

      return task;
    },
    
    removeTask(id) {
      delete this[id];
    },

    renameTask(id, title) {
      this[id].title = title;
    },

    addSubtask(id, title) {
      const task = this[id];
      const subtask = this.addTask(title, task);
      task.subtaskIds.push(subtask.id);
    },

    removeSubtask(id, index) {
      const task = this[id];
      const subtaskId = task.subtaskIds[index];
      task.subtaskIds.splice(index, 1);
      this.removeTask(subtaskId);
    },

    toggleCompleted(id) {
      this[id].completed = !this[id].completed;
    },

    setDueDate(id, date) {
      this[id].dueDate = date;
    },

    removeDueDate(id) {
      this[id].dueDate = null;
    },

    setDescription(id, description) {
      this[id].description = description;
    },
  },
});
