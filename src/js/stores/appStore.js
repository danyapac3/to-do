import defineStore from "/js/lib/store";
import useProjectsStore from "./projectsStore";

const useAppStore = defineStore({
  state: {
    currentProject: "system.today",
  },

  actions: {
    setCurrentProject(id) {
      const projectsStore = useProjectsStore();
      const possibleIds = [
        'system.today',
        'system.upcoming',
        'system.inbox',
        ...Object.keys(projectsStore.$state),
      ];
      if (!possibleIds.includes(id)) {
        throw new Error(`There is no such project with id: ${id}`);
      }
      this.currentProject = id;
    }
  },
});

export default useAppStore;