import React, { useState } from 'react';
import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';

import initialData from './initial-data';
import Column from './column';
import UpdateToDoContext from './UpdateToDoContext';

const Container = styled.div`
  display:flex;
`

function ReactDND() {
  const [ DND, setDND ] = useState(initialData);

  // Synchronously updates state to reflect drag & drop result
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
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }

      const newState = {
        ...DND,
        columns: {
          ...DND.columns,
          [newColumn.id]: newColumn
        }
      }

      setDND(newState);
      return
    }

    // Moving from one column to another
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

    const newState = {
      ...DND,
      columns: {
        ...DND.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }
    setDND(newState);
  } 

  // Add new task to To do list 
  const addNewTask = () => {
      const storeAllIDs = [];

      // Loop through initial data to find out value of last key
      for (let key in initialData.tasks) {
        if (initialData.tasks.hasOwnProperty(key)) {
            // console.log(`${key} : ${initialData.tasks[key].content}`);
            storeAllIDs.push(key.slice(-1));
        }
      }
      const newTaskID = `task-${parseInt(Math.max(...storeAllIDs)) + 1}`;

      if (document.querySelector('.inputNewTaskContent').value !== "") {
        // Add new task
        initialData.tasks[newTaskID] = { id: newTaskID, content: document.querySelector('.inputNewTaskContent').value };
        
        // ID of new task gets inserted into first column
        const newToDos = {
          tasks: { ...initialData.tasks },
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
          columnOrder: [...DND.columnOrder]
        }
        setDND(newToDos);

        document.querySelector('.inputNewTaskContent').value = "";
      }
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
