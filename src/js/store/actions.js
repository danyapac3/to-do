import { v4 as uuidv4 } from 'uuid';

export default {
  addProject(context, {title}) {
    context.commit('addProject', {title, id: uuidv4()});
  },
  addList(context, {projectId, title}) {
    context.commit('addList', {projectId, title, id: uuidv4()});
  },
  addTask(context, payload) {
    context.commit('addTask', {id: uuidv4(), ...payload});
  },
  moveTask(context, {oldListId, newListId, oldIndex, newIndex}) {
    if ((oldListId === newListId) && (oldIndex === newIndex)) return;
    context.commit('moveTask', {oldListId, newListId, oldIndex, newIndex});
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