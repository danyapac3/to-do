// TODO: Implement entities for task, list and project and come up with connections;
import { v4 as uuid } from 'uuid';

const createVirtuallyMerged = (mainObj, secondaryObj) => {
  return new Proxy(mainObj, {
    get(obj, prop) {
      return prop in obj 
        ? mainObj[prop]
        : secondaryObj[prop];
    },
    set(obj, prop, value) {
      if (prop in obj) {
        mainObj[prop] = value;
        return true;
      }
      return false;
    }
  });
}

export const createTask = ({title, parent, completed, description, dueDate}) => {
  const data = {
    title: title || "",
    type: "task",
    id: uuid(),
    completed: completed || false,
    subtaskIds: [],
    description: description || "",
    parentId: parent ? parent.id : null,
    parentType: parent ? parent.type : null,
    dueDate: dueDate || null,
  };

  const methods = {
    setTitle(title) {
      data.title = title;
    },
    setParent(parent) {
      data.parentId = parent.id;
      data.parentType = parent.type;
    },
    toggleCompleted() {
      data.completed = !data.completed;
    },
    changeDescription() {
      
    }
    
  };

  return createVirtuallyMerged(data, methods)
  
}


export const createList = ({title}) => {
  const data = {
    title: title,
    type: "list",
    id: uuid(),
    taskIds: [],
    parentId: null,
    parentType: null,
  }

  const methods = {
  };

  return createVirtuallyMerged(data, methods);
};


export const createProject = ({title}) => {
  const data = {
    title,
    type: "project",
    id: uuid(),
    listIds: []
  }

  const methods = {
  };

  return createVirtuallyMerged(data, methods);
}
