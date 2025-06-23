export default {
  addProject(state, payload) {
    state.projects.push(payload);
    return state;
  },
  addTask(state, {id, listId, title}) {
    state.tasks.push({id, title, listId});
    const list = state.lists.find(l => l.id === listId);
    list.taskIds.push(id);
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