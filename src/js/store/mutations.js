export default {
  addProject(state, payload) {
    state.projects.push(payload);
    return state;
  },
  addList(state, {id, projectId, title}) {
    state.lists.push({id, title});
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