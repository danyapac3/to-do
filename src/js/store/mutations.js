export default {
  addProject(state, payload) {
    state.projects.push(payload);
    return state;
  },
  
  addTask(state, {id, listId, title}) {
    state.tasks.push({id, title, listId, completed: false});
    const list = state.lists.find(l => l.id === listId);
    list.taskIds.push(id);
    return state;
  },
  
  addList(state, {id, projectId, title}) {
    state.lists.push({id, title, taskIds: []});
    const project = state.projects.find(p => p.id === projectId);
    project.listIds.push(id);
    return state;
  },

  moveTask(state, {oldListId, newListId, oldIndex, newIndex}) {
    const listById = listId => state.lists.find(l => l.id === listId)
    const oldList = listById(oldListId);
    const newList = listById(newListId);
    const taskId = oldList.taskIds[oldIndex];
    const task = state.tasks.find(t => t.id === taskId);

    if (oldListId === newListId) {
      newList.taskIds.splice(oldIndex, 1);
      newList.taskIds.splice(newIndex, 0, taskId);
    } else {
      task.listId = newListId;
      oldList.taskIds.splice(oldIndex, 1);
      newList.taskIds.splice(newIndex, 0, taskId);
    }

    return state;
  },

  removeList(state, {id}) {
    const project = state.projects.find(p => p.listIds.includes(id));
    const listIdIndex = project.listIds.indexOf(id);
    project.listIds.splice(listIdIndex, 1);
    state.tasks = state.tasks.filter(t => t.listId !== id);
    state.lists = state.lists.filter(l => l.id !== id);
    return state;
  },

  moveList(state, { oldIndex, newIndex, projectId}) {
    const currentProject = state.projects.find(p => p.id === projectId);
    const listId = currentProject.listIds[oldIndex];
    currentProject.listIds.splice(oldIndex, 1);
    currentProject.listIds.splice(newIndex, 0, listId);
  },
  
  setTaskСompleteness(state, {id, completed}) {
    state.tasks.find(t => t.id === id).completed = completed;
    return state;
  },

  clearProject(state, payload) {
    state.projects.splice(payload.index, 1);
    return state;
  },

  setCurrentProjectId(state, id) {
    return {currentProjectId: id};
  }
};