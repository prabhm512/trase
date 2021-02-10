
const initialData = {
  // _id: '',
  tasks:  {
    'task-1': { id: 'task-1', content: "Demo", inProgressDate: 0, pausedDate: 0, doneDate: 0, timesheet: {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0}, totalTaskTime: 0, engagement: '', cost: 0 } 
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: []
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: []
    },
    'column-3': {
      id: 'column-3',
      title: 'Paused',
      taskIds: []
    },
    'column-4': {
      id: 'column-4',
      title: 'Done',
      taskIds: []
    }
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
  teamName: ''
}

export default initialData
