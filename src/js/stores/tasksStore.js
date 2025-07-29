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


const useTasksStore = defineStore({
  state: {
    t1: {
      id: "t1",
      title: "Design homepage layout Design homepage layout Design homepage layout Design homepage layout Design homepage layout",
      type: "task",
      completed: false,
      subtaskIds: [],
      description: "Create mockups and responsive layout for homepage using Figma and TailwindCSS.",
      parentId: "l1",
      parentType: "list",
      dueDate: "2025-08-01",
    },
    t2: {
      id: "t2",
      title: "Setup Node.js server",
      type: "task",
      completed: false,
      subtaskIds: [],
      description: "",
      parentId: "l2",
      parentType: "list",
      dueDate: "2025-08-03",
    },
    t3: {
      id: "t3",
      title: "Draft email template",
      type: "task",
      completed: true,
      subtaskIds: [],
      description: "Write a first version of the email for summer sales campaign.",
      parentId: "l3",
      parentType: "list",
      dueDate: "2025-07-20",
    },
    t4: {
      id: "t4",
      title: "Schedule posts",
      type: "task",
      completed: false,
      subtaskIds: [],
      description: "Use Buffer to schedule Instagram and Facebook posts for August.",
      parentId: "l4",
      parentType: "list",
      dueDate: null,
    },
    t5: {
      id: "t5",
      title: "Run 5km",
      type: "task",
      completed: false,
      subtaskIds: [],
      description: "Try to run 5 kilometers in under 30 minutes.",
      parentId: "l5",
      parentType: "list",
      dueDate: "2025-07-27",
    },
    t6: {
      id: "t6",
      title: "Read 'Atomic Habits'",
      type: "task",
      completed: true,
      subtaskIds: [],
      description: "Finish reading chapter 5 and take notes.",
      parentId: "l6",
      parentType: "list",
      dueDate: null,
    },
    t7: {
      id: "t7",
      title: "Pack clothes",
      type: "task",
      completed: false,
      subtaskIds: [],
      description: "Pack weather-appropriate clothes for 7-day trip.",
      parentId: "l7",
      parentType: "list",
      dueDate: "2025-08-05",
    },
    t8: {
      id: "t8",
      title: "Research Vienna",
      type: "task",
      completed: false,
      subtaskIds: [],
      description: "Find things to do and food to try in Vienna.",
      parentId: "l8",
      parentType: "list",
      dueDate: "2025-08-02",
    },
    t9: {
      id: "t9",
      title: "Learn closures",
      type: "task",
      completed: false,
      subtaskIds: [],
      description: "Watch video and complete exercises on JS closures.",
      parentId: "l9",
      parentType: "list",
      dueDate: "2025-07-30",
    },
    t10: {
      id: "t10",
      title: "Practice speaking",
      type: "task",
      completed: false,
      subtaskIds: [],
      description: "30 minutes of English conversation on iTalki.",
      parentId: "l10",
      parentType: "list",
      dueDate: "2025-07-28",
    },
  },
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
      task.subtaskIds.push(subtask.id);
    },

    removeSubtask(id, index) {
      const task = this[id];
      const subtaskId = task.subtaskIds[index];
      task.subtaskIds.splice(index, 1);
    },

    toggleCompleted(id) {
      const task = this[id]; 
      task.completed = !task.completed;
      return task;
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

export default useTasksStore;