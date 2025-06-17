import {v4 as uuidv4} from 'uuid';

export default {
  projects: [
    {
      id: 'p1',
      title: 'hello world on assembly',
      sectionIds: []
    },
    {
      id: 'p2',
      title: 'project2',
      sectionIds: ['s1', 's2'],
    },
  ],
  sections: [
    {
      id: 's1',
      title: 'to-do',
    },
    {
      id: 's2',
      title: 'done',
    }
  ],

  currentProject: null,
}