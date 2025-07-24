import defineStore from "/js/lib/store";
import useListsStore from "./listsStore";
import { v4 as uuid } from 'uuid';

const useProjectsStore = defineStore({
  state: {
    'p-id-1' : {
      title: 'Hello world',
      id: 'p-id-1',
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
    }
  },
});

const listsStore = useListsStore();

export default useProjectsStore;