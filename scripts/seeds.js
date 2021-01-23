require('dotenv').config();

const mongoose = require("mongoose");
const db = require("../models");

// Connect to the Mongo DB
const PWD = process.env.MONGO_PWD;

const databaseURL = `mongodb+srv://prabhm512:${encodeURIComponent(PWD)}@cluster0.ltepl.mongodb.net/project3?retryWrites=true&w=majority`;

mongoose.connect( process.env.MONGODB_URI || databaseURL, {
  useNewUrlParser: true,
  useFindAndModify: false
});

const tasksSeed = {
  tasks: {
      'task-1': { id: 'task-1', content: 'Demo Task', inProgressDate: 0, pausedDate: 0, doneDate: 0, time: 0}
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1']
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
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4']
}

db.Tasks
    .deleteMany({})
    .then(() => db.Tasks.collection.insertOne(tasksSeed))
    .then(data => {
        console.log(data);
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
