export default {
  addProject(context, payload) {
    context.commit('addProject', payload);
  },
  clearProject(context, payload) {
    context.commit('clearProject', payload);
  }
};