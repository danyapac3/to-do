import {createTask, createList, createProject} from './entities';

export default {
  addProject(context, {title}) {
    context.commit('addProject', {title});
  },


  addTask(context, {title, parent}) {
    const task = createTask({title, parent});
    context.commit('addTask', {task});
    if (parent.type === 'list') {
      context.commit('addTaskToList', {taskId: task.id, listId: parent.id});
    }
  },
  
  moveTask(context, {oldListId, newListId, oldIndex, newIndex}) {
    if ((oldListId === newListId) && (oldIndex === newIndex)) return;
    context.commit('moveTask', {oldListId, newListId, oldIndex, newIndex});
  },
  
  addList(context, {projectId, title}) {
    context.commit('addList', {title, projectId});
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

  toggleTaskСompleteness(context, payload) {
    context.commit('toggleTaskСompleteness', payload)
  },

  clearProject(context, payload) {
    context.commit('clearProject', payload);
  },

  setCurrentProjectId(context, {id}) {
    context.commit('setCurrentProjectId', id)
  }
};