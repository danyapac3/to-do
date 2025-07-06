export default {
  addProject(state, payload) {
    state.projects.push(payload);
    return state;
  },
  addList(state, {id, projectId, title}) {
    state.lists.push({id, title, taskIds: []});
    const project = state.projects.find(p => p.id === projectId);
    project.listIds.push(id);
    return state;
  },
  addTask(state, {id, listId, title}) {
    state.tasks.push({id, title, listId, completed: false});
    const list = state.lists.find(l => l.id === listId);
    list.taskIds.push(id);
    return state;
  },
  moveTask(state, {oldListId, newListId, oldIndex, newIndex}) {
    if (oldListId === newListId) {
      const list = state.lists.find(l => l.id === newListId);
      const taskId = list.taskIds[oldIndex];
      const task = state.tasks.find(t => t.id === taskId);
      list.taskIds.splice(oldIndex, 1);
      list.taskIds.splice(newIndex, 0, taskId)
    }

    return state;
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