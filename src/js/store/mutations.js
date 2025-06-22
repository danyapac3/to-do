export default {
  addProject(state, payload) {
    state.projects.push(payload);
    return state;
  },
  addTask(state, {projectId, sectionId, title}) {
    state.tasks.push({projectId, sectionId, title});
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