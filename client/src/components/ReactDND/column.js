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
  width: 275px;
  display: flex;
  flex-direction: column;
`

const Title = styled.h3`
  border: ${(props) => 
    props.title === 'To Do' ? '1px solid #1874cd;' : props.title === 'In Progress' ? '1px solid red;' : props.title === 'Paused' ? '1px solid #D4AF37;' : '1px solid green;'}
  border-radius: 2px;
  padding: 8px;
  background-color: ${props => 
    props.title === 'To Do' ? '#1874cd' : props.title === 'In Progress' ? '#ff0000' : props.title === 'Paused' ? '#D4AF37' : 'green'}
`

const TaskList = styled.div`
  padding: 8px;
  flex-grow: 1;
  transition: background-color 0.2s ease;
  min-height: 100px;
  position: relative;
`

  // color: ${props => 
  //   props.title === 'To Do' ? '#1874cd' : props.title === 'In Progress' ? '#ff0000' : props.title === 'Paused' ? '#D4AF37' : 'green'}

  // background-color: ${(props) =>
  //   props.isDraggingOver ? 'skyblue' : 'white'}

function Column(props) {

  // Show hidden text area
  const displayTextArea = () => {
    document.querySelector(".addTasks").style.display = "contents";
  }
        
  return (
    <Container>
        <Title title={props.column.title} style={{color: 'white', textAlign: 'center'}}>{ props.column.title === 'To Do' 
        ? 
        <div>
          {/* <TitleText title={props.column.title}> */}
            { props.column.title }
          {/* </TitleText> */}
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
              <Task key={task.id} column={props.column} task={task} index={index} userID={props.userID} currState={props.currState} editTaskContentCB={props.editTaskContentCB} deleteTaskCB={props.deleteTaskCB} handleAssignCB={props.handleAssignCB} engagements={props.engagements} members={props.members} handleTransferCB={props.handleTransferCB}/>
            ))}
            {provided.placeholder} {/* Increase available space in a droppable whenever needed during a drag*/}
          </TaskList>
        )}
      </Droppable>
    </Container>
  )
}

export default Column;
