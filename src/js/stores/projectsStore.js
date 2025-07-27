import defineStore from "/js/lib/store";
import useListsStore from "./listsStore";
import { v4 as uuid } from 'uuid';

const listsStore = useListsStore();

const useProjectsStore = defineStore({
  state: {
    'p1': { id: "p1", title: "Frontend Development", type: "project", listIds: ["l1", "l2"], taskIds: [] },
    'p2': { id: "p2", title: "Marketing Campaign", type: "project", listIds: ["l3", "l4"], taskIds: [] },
    'p3': { id: "p3", title: "Personal Goals", type: "project", listIds: ["l5", "l6"], taskIds: [] },
    'p4': { id: "p4", title: "Travel Planning", type: "project", listIds: ["l7", "l8"], taskIds: [] },
    'p5': { id: "p5", title: "Learning Plan", type: "project", listIds: ["l9", "l10"], taskIds: [] },
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
        useListsStore().setParent(listId, destinationProject)
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