import React from 'react'
import styled from 'styled-components'
import Task from './task'
import NewTask from '../NewTaskAddBox/NewTaskAddBox';
import { Droppable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import './ReactDND.css';

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
  position: relative;
`

function Column(props) {

  // Show hidden text area
  const displayTextArea = () => {
    document.querySelector(".addTasks").style.display = "contents";
  }
        
  return (
    <Container>

      <Title>{ props.column.title === 'To do' 
      ? 
      <div>
        { props.column.title }
        <h4 className="openTextArea"><FontAwesomeIcon icon={faPlus} onClick={displayTextArea}></FontAwesomeIcon></h4>
        <NewTask></NewTask>
      </div>
      : 
      props.column.title }
      </Title>

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
              <Task key={task.id} task={task} index={index} currState={props.currState} editTaskContentCB={props.editTaskContentCB}/>
            ))}
            {provided.placeholder} {/* Increase available space in a droppable whenever needed during a drag*/}
          </TaskList>
        )}
      </Droppable>
    </Container>
  )
}

export default Column;
