import React, { useEffect, useState } from 'react';

// react-beautiful-dnd
import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

// Utils
import UpdateToDoContext from '../../utils/contexts/UpdateToDoContext';
import API from '../../utils/apis/API';

// Styling
import styled from 'styled-components';
import './ReactDND.css';

const Container = styled.div`
  display:flex;
`

function ReactDND() {

  const [ DND, setDND ] = useState(initialData);

  useEffect(() => {
    // Load tasks on /api/tasks route on component mount
    loadTasks();
  }, []);
  
  // Updates state to reflect drag & drop result
  const onDragEnd = result => {
    const { destination, source, draggableId } = result

    // Exit if task dragged outside of a droppable
    if (!destination) {
      return
    }

    // Check whether location of draggable changed
    // Users may put draggable back into the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = DND.columns[source.droppableId]
    const finish = DND.columns[destination.droppableId]

    // Moving tasks to a different position in the same column
    if (start === finish) {
      const updatedTaskIds = Array.from(start.taskIds)
      updatedTaskIds.splice(source.index, 1)
      updatedTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: updatedTaskIds
      }

      const newState = {
        ...DND,
        columns: {
          ...DND.columns,
          [newColumn.id]: newColumn
        }
      }

      // Do not set state inside method that does an axios call as task movement lags.
      setDND(newState);
      saveTask(newState);
      return
    }

    // Moving tasks from 1 column to another
    // Do not allow task to move back to 'To Do' column once it has been moved out
    if ((start.id !== 'column-2' || start.id !== 'column-3' || start.id !== 'column-4') && finish.id !== 'column-1') {
      const startTaskIds = Array.from(start.taskIds)
        startTaskIds.splice(source.index, 1)
        const newStart = {
          ...start,
          taskIds: startTaskIds
      }
  
      const finishTaskIds = Array.from(finish.taskIds)
        finishTaskIds.splice(destination.index, 0, draggableId)
        const newFinish = {
          ...finish,
          taskIds: finishTaskIds
      }
    
      let newState = {
        ...DND,
        columns: {
          ...DND.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      }

      // Record the date task was moved into 'In Progress' column
      if (finish.id === 'column-2') {

        newState = {
          ...DND, 
          tasks: { 
            ...DND.tasks,
            [draggableId]: { ...DND.tasks[draggableId], inProgressDate: Date.now() }
          },
          columns: {
            ...DND.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
          }
        }
      } 

      // Record the date task was moved FROM 'In Progress' column into 'Paused' column 
      else if (finish.id === 'column-3' && start.id === 'column-2')  {

        let taskTime;

        // Calculate exact time (in miilliseconds) that task was in 'In Progress' column
        if (DND.tasks[draggableId].inProgressDate !== 0) {
          taskTime = Date.now() - DND.tasks[draggableId].inProgressDate;
        }

        const timeInSeconds = Math.round(taskTime / 1000);

        newState = {
          ...DND, 
          tasks: { 
            ...DND.tasks,
            [draggableId]: { ...DND.tasks[draggableId], pausedDate: Date.now(), time: DND.tasks[draggableId].time + timeInSeconds}
          },
          columns: {
            ...DND.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
          }
        } 
      }

      // Record the date task was moved FROM 'In Progress' column into 'Done' column 
      else if (finish.id === 'column-4'  && start.id === 'column-2') {

        let taskTime;

        // Calculate exact time (in miilliseconds) that task was in 'In Progress' column
        if (DND.tasks[draggableId].inProgressDate !== 0) {
          taskTime = Date.now() - DND.tasks[draggableId].inProgressDate;
        }

        const timeInSeconds = Math.round(taskTime / 1000);
        console.log(timeInSeconds);

        newState = {
          ...DND, 
          tasks: { 
            ...DND.tasks,
            [draggableId]: { ...DND.tasks[draggableId], doneDate: Date.now(), time: DND.tasks[draggableId].time + timeInSeconds}
          },
          columns: {
            ...DND.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
          }
        } 
      }
      // console.log(newState);
      // Do not set state inside method that does an axios call as task movement lags.
      setDND(newState);
      saveTask(newState);
    }
  } 

  // Add new task to To do list 
  const addNewTask = () => {
    const storeAllIDs = [];
    let newTaskID;

    // Loop through initial data to find out value of last key
    for (let key in DND.tasks) {
      if (DND.tasks.hasOwnProperty(key)) {
          // console.log(`${key} : ${DND.tasks[key].content}`);
          storeAllIDs.push(key.slice(-1));
      }
    }
    
    if (storeAllIDs.length !== 0) {
      newTaskID = `task-${parseInt(Math.max(...storeAllIDs)) + 1}`;
    } else {
      newTaskID = 'task-1';
    }

    if (document.querySelector('.inputNewTaskContent').value !== "") {

      // Add new task
      // New timer instantiated on creation of new task
      DND.tasks[newTaskID] = { id: newTaskID, content: document.querySelector('.inputNewTaskContent').value, inProgressDate: 0, pausedDate: 0, doneDate: 0, time: 0 };

      // ID of new task gets inserted into first column
      const newToDos = {
        tasks: { ...DND.tasks },
        columns: {
          'column-1': {
            id: 'column-1',
            title: 'To do',
            taskIds: [newTaskID, ...DND.columns['column-1'].taskIds]
          },
          'column-2': {
            id: DND.columns['column-2'].id,
            title: DND.columns['column-2'].title,
            taskIds: [...DND.columns['column-2'].taskIds]
          },
          'column-3': {
            id: DND.columns['column-3'].id,
            title: DND.columns['column-3'].title,
            taskIds: [...DND.columns['column-3'].taskIds]
          },
          'column-4': {
            id: DND.columns['column-4'].id,
            title: DND.columns['column-4'].title,
            taskIds: [...DND.columns['column-4'].taskIds]
          },            
        },
        columnOrder: [...DND.columnOrder],
      }
      // Do not set state inside method that does an axios call as task movement lags.
      setDND(newToDos);
      saveTask(newToDos);

      // console.log(newToDos);
      document.querySelector('.inputNewTaskContent').value = "";
    }
  }

  // Get all tasks
  const loadTasks = () => {
    API.getTasks()
    .then(res => {
      setDND(res.data[0])
    })
    .catch(err => console.log(err));
  }

  // Post task to /api/tasks route
  const saveTask = (taskData) => {
    API.saveTask(taskData)
    .catch(err => console.log(err));
  }

  return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
            {DND.columnOrder.map(columnId => {
              const column = DND.columns[columnId]
              const tasks = column.taskIds.map(
                  taskId => DND.tasks[taskId]
            )

            return (
              <UpdateToDoContext.Provider value={addNewTask} key={column.id}>
                <Column column={column} tasks={tasks}/>
              </UpdateToDoContext.Provider>
            )
          })}
        </Container>
      </DragDropContext>
  )
}

export default ReactDND;
