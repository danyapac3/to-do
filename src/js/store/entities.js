// TODO: Implement entities for task, list and project and come up with connections;
import { v4 as uuid } from 'uuid';

export const createTask = ({title, parent, completed, description, dueDate}) => {
  return {
    title,
    type: "task",
    id: uuid(),
    completed: completed || false,
    subtaskIds: [],
    description: description || "",
    parentId: parent.id || null,
    parentType: parent.type || null,
    dueDate: dueDate || null,
  }
}


export const createList = ({title}) => {
  return {
    title: title,
    type: "list",
    id: uuid(),
    taskIds: [],
    parentId: null,
    parentType: null,
  }
};


export const createProject = ({title}) => {
  return {
    title,
    type: "project",
    id: "p1",
    listIds: ["l1", "l2"]
  }
}
