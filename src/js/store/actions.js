import { v4 as uuidv4 } from 'uuid';

export default {
  addProject(context, {title}) {
    context.commit('addProject', {title, id: uuidv4()});
  },

  addTask(context, payload) {
    context.commit('addTask', {id: uuidv4(), ...payload});
  },
  
  moveTask(context, {oldListId, newListId, oldIndex, newIndex}) {
    if ((oldListId === newListId) && (oldIndex === newIndex)) return;
    context.commit('moveTask', {oldListId, newListId, oldIndex, newIndex});
  },
  
  addList(context, {projectId, title}) {
    context.commit('addList', {projectId, title, id: uuidv4()});
  },

  moveListOutside(context, { sourceId, destinationId, listId }) {
    context.commit('moveListOutside', {sourceId, destinationId, listId});
  },

  moveList(context, { oldIndex, newIndex, sourceId, destinationId }) {
    const sourceProject = context.state.projects.find(p => p.id === sourceId);
    const listId = sourceProject.listIds[oldIndex];

    if (sourceId === destinationId) {
      context.commit('moveListWithin', { oldIndex, newIndex, sourceId, listId });
    }
  },

  removeList(context, {id}) {
    context.commit('removeList', {id});
  },

  renameList(context, {title, id}) {
    context.commit('renameList', {title, id});
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