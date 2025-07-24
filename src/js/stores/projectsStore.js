import defineStore from "/js/lib/store";
import { v4 as uuid } from 'uuid';

const createProject = (title, id) => ({
  title: "",
  id: id,
  type: "project",
  listIds: []
});

export default defineStore({
  state: {},
  actions: {},
});