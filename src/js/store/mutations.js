const getProjectById = (state, id) => state.projects.find(p => p.id === id);
const getListById = (state, id) => state.lists.find(l => l.id === id);
const getTaskById = (state, id) => state.tasks.find(t => t.id === id);

export default {
  addProject(state, payload) {
    state.projects.push(payload);
    return state;
  },

  setCurrentProjectId(state, id) {
    return {currentProjectId: id};
  },


  addTask(state, {id, listId, title}) {
    state.tasks.push({id, title, listId, completed: false});
    const list = getListById(state, listId);
    list.taskIds.push(id);
    return state;
  },

  moveTask(state, {oldListId, newListId, oldIndex, newIndex}) {
    const listById = listId => state.lists.find(l => l.id === listId)
    const oldList = listById(oldListId);
    const newList = listById(newListId);
    const taskId = oldList.taskIds[oldIndex];
    const task = state.tasks.find(t => t.id === taskId);
    
    if (oldListId === newListId) {
      newList.taskIds.splice(oldIndex, 1);
      newList.taskIds.splice(newIndex, 0, taskId);
    } else {
      task.listId = newListId;
      oldList.taskIds.splice(oldIndex, 1);
      newList.taskIds.splice(newIndex, 0, taskId);
    }
    
    return state;
  },

  toggleTaskСompleteness(state, {id}) {
    const task = getTaskById(state, id);
    task.completed = !task.completed;
    return state;
  },


  addList(state, {id, projectId, title}) {
    state.lists.push({id, title, taskIds: []});
    const project = getProjectById(state, projectId);
    project.listIds.push(id);
    return state;
  },

  removeList(state, {id}) {
    const project = state.projects.find(p => p.listIds.includes(id));
    const listIdIndex = project.listIds.indexOf(id);
    project.listIds.splice(listIdIndex, 1);
    state.tasks = state.tasks.filter(t => t.listId !== id);
    state.lists = state.lists.filter(l => l.id !== id);
    return state;
  },

  moveListWithin(state, { oldIndex, newIndex, sourceId, listId}) {
    const project = getProjectById(state, sourceId);
    project.listIds.splice(oldIndex, 1);
    project.listIds.splice(newIndex, 0, listId);
  },

  moveListOutside(state, { sourceId, destinationId, listId }) {
    const sourceProject = getProjectById(state, sourceId);
    const destinationProject = getProjectById(state, destinationId);
    const listIdIndex = sourceProject.listIds.indexOf(listId);
    sourceProject.listIds.splice(listIdIndex, 1);
    destinationProject.listIds.splice(0, 0, listId);
  }
  ,

  renameList(state, {id, title}) {
    getListById(state, id).title = title;
    return state;
  },
};