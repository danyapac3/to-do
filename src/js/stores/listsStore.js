import defineStore from "/js/lib/store";
import { v4 as uuid } from 'uuid';

const createList = (title, id) => ({
  title: "",
  type: "list",
  id: id,
  taskIds: [],
  parentId: null,
  parentType: null,
});

export default defineStore({
  state: {},
  actions: {},
});