import { v4 as uuidv4 } from 'uuid';

export default {
  addProject(context, {title}) {
    context.commit('addProject', {title, id: uuidv4()});
  },
  addTask(context, payload) {
    context.commit('addTask', {id: uuidv4(), ...payload});
  },
  setTaskСompleteness(context, payload) {
    context.commit('setTaskСompleteness', payload)
  },
  clearProject(context, payload) {
    context.commit('clearProject', payload);
  },
  setCurrentProjectId(context, {id}) {
    context.commit('setCurrentProjectId', id)
  }
};