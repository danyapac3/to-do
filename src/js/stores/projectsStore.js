import defineStore from "/js/lib/store";
import useListsStore from "./listsStore";
import { v4 as uuid } from 'uuid';

const listsStore = useListsStore();

const useProjectsStore = defineStore({
  state: {
    'p-id-1' : {
      title: 'Hello world',
      id: 'p-id-1',
      type: 'project',
      listIds: [],
      taskIds: [],
    },
    'p-id-2' : {
      title: 'Clown',
      id: 'p-id-2',
      type: 'project',
      listIds: [],
      taskIds: [],
    },
    'p-id-3' : {
      title: 'Dous',
      id: 'p-id-3',
      type: 'project',
      listIds: [],
      taskIds: [],
    }
  },

  actions: {
    addProject(title) {
      const id = uuid();
      const project = {
        title: title || '',
        id,
        type: 'project',
        listIds: [],
        taskIds: [],
      }

      this[id] = project;

      return project;
    },

    renameProject(id, title) {
      const project = this[id];
      project.title = title;
    },

    removeProject(id) {
      const project = this[id];
    },

    addList(projectId, title) {
      const project = this[projectId];
      const list = listsStore.addList(title, project);

      project.listIds.push(list.id);
    },

    transferList(listId, sourceId, destinationId, index = 0) {
      const sourceProject = this[sourceId];
      const destinationProject = this[projectId];
      const listIndex = sourceProject.listIds.indexOf(listId);
      sourceProject.listIds.splice(listIndex, 1);
      destinationProject.listIds.splice(index, 0, listId);

      if (sourceId !== destinationId) {
        useListsStore().changeParent(listId, destinationProject)
      }
    },

    moveList(projectId, indexFrom, indexTo) {
      const project = this[projectId];
      const listId = project.listIds[indexFrom];
      project.listIds.splice(indexFrom, 1);
      project.listIds.splice(indexTo, 0, listId);
    }
  },
});

export default useProjectsStore;