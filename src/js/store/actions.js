import { v4 as uuidv4 } from 'uuid';

export default {
  addProject(context, {title}) {
    context.commit('addProject', {title, id: uuidv4()});
  },
  clearProject(context, payload) {
    context.commit('clearProject', payload);
  },
  setCurrentProjectId(context, {id}) {
    context.commit('setCurrentProjectId', id)
  }
};