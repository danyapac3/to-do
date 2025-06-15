export default {
  addProject(state, payload) {
    state.projects.push(payload);
    return state;
  },
  clearProject(state, payload) {
    state.projects.splice(payload.index, 1);
    return state;
  }
};