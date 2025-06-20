import {v4 as uuidv4} from 'uuid';

export default {
  projects: [
    {
      id: 'p1',
      title: 'hello world on assembly',
      listIds: []
    },
    {
      id: 'p2',
      title: 'project2',
      listIds: ['l1', 'l2'],
    },
  ],
  lists: [
    {
      id: 'l1',
      title: 'to-do',
    },
    {
      id: 'l2',
      title: 'done',
    }
  ],

  currentProjectId: 'p2',
}