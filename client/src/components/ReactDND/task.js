import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDragDisabled
      ? 'lightgrey'
      : props.isDragging
      ? 'lightgreen'
      : 'white'};
`

function Task(props) {

  // const isDragDisabled = this.props.task.id === 'task-1'
  return (
    <Draggable
      draggableId={props.task.id}
      index={props.index}
      // isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps} // Applied to part of component that we want to control the drag with. 
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          // isDragDisabled={isDragDisabled}
        >
          {props.task.content}
          <br></br>
          {/* {props.task.time} */}
        </Container>
      )}
    </Draggable>
  )
}

export default Task;
