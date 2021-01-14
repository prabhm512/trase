import React, { useState } from 'react';
import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';

import initialDataDND from './initial-data';
import Column from './column';

const Container = styled.div`
  display:flex;
`

function ReactDND() {
  const [ DND, setDND ] = useState(initialDataDND);

  // Synchronously updates state to reflect drag & drop result
  const onDragEnd = result => {
    const { destination, source, draggableId } = result

    // Exit if task dragged outside of a droppable
    if (!destination) {
      return
    }

    // Check whether location of draggable changed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = DND.columns[source.droppableId]
    const finish = DND.columns[destination.droppableId]

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

    // Moving from one list to another
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
        <Container>
            {DND.columnOrder.map(columnId => {
            const column = DND.columns[columnId]
            const tasks = column.taskIds.map(
                taskId => DND.tasks[taskId]
            )

            return (
                <Column key={column.id} column={column} tasks={tasks} />
            )
            })}
        </Container>
        </DragDropContext>
    )
}

export default ReactDND;
