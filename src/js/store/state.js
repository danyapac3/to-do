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
      taskIds: [
        't1',
        't2',
        't3',
        't4',
        't5',
        't6',
        't7',
        't8',
        't9',
        't10',
        't11',
        't12',
        't13',
      ],
    },
    {
      id: 'l2',
      title: 'done',
      taskIds: ['t14'],
    }
  ],
  tasks: [
    {title: 'click me', id: 't1', listId: 'l1'},
    {title: 'click me 1', id: 't2', listId: 'l1'},
    {title: 'click me 2', id: 't3', listId: 'l1'},
    {title: 'click me 3', id: 't4', listId: 'l1'},
    {title: 'click me 4', id: 't5', listId: 'l1'},
    {title: 'click me 5', id: 't6', listId: 'l1'},
    {title: 'click me 6', id: 't7', listId: 'l1'},
    {title: 'click me 7', id: 't8', listId: 'l1'},
    {title: 'click me 8', id: 't9', listId: 'l1'},
    {title: 'click me 9', id: 't10', listId: 'l1'},
    {title: 'click me 10', id: 't11', listId: 'l1'},
    {title: 'click me 11', id: 't12', listId: 'l1'},
    {title: 'click me 12', id: 't13', listId: 'l1'},
    {title: 'click me 13', id: 't14', listId: 'l2'},
  ],

  currentProjectId: 'p2',
}