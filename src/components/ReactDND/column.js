import React from 'react'
import styled from 'styled-components'
import Task from './task'
import { Droppable } from 'react-beautiful-dnd'

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`
const Title = styled.h3`
  padding: 8px;
`
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? 'skyblue' : 'white'}
  flex-grow: 1;
  min-height: 100px;
`

function Column(props) {
  return (
    <Container>
      <Title>{props.column.title}</Title>
      {/* Child of Droppable has to be a function that returns a react component */}
      <Droppable droppableId={props.column.id} type="TASK">
        {(provided, snapshot) => (
          <TaskList
            // Supplies DOM Node of Task List to react-beautiful-dnd
            ref={provided.innerRef}
            // droppableProps need to be applied to doppable components
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {props.tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder} {/* Increase available space in a droppable whenever needed during a drag*/}
          </TaskList>
        )}
      </Droppable>
    </Container>
  )
}

export default Column;
