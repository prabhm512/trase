import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

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

  // Managing state of modal that allows tasks to be edited
  const [show, setShow] = useState(false);

  // Manage state of modal that allows tasks to be assigned to enagagements
  const [assignShow, setAssignShow] = useState(false);

  // Manage state of radio that shows inside assign tasks modal
  const [radioValue, setRadioValue] = useState('female');

  const [transferShow, setTransferShow] = useState(false);
  // Manage state of radio that shows inside transfer tasks modal
  const [transfer, setTransfer] = useState('');

  const handleEditClose = event => { 
    setShow(false);

    // New content of task
    const editedContent = document.querySelector(".content").value;
    props.editTaskContentCB(props.task.id, editedContent);
  };

  const handleShow = () => setShow(true);

  const handleDelete = () => {
    props.deleteTaskCB(props.task.id);
  }

  const handleAssignInTasks = () => {
    if (assignShow === true && props.engagements.length !== 0) {
      props.handleAssignCB(props.task.id, radioValue);
      setAssignShow(false);
    }

    else if (assignShow === false) {
      setAssignShow(true);
    }
    
    else {}
  };

  const handleTransfer = () => {
    if (transferShow === true && props.members.length !== 0) {
      setTransferShow(false);
      props.handleTransferCB(props.task.id, transfer);
    }

    else if (transferShow === false) {
      setTransferShow(true);
    }

    else {}
  }

  const handleAssignChange = event => {
    setRadioValue(event.target.value);
  }

  const handleTransferChange = event => {
    setTransfer(event.target.value);
  }

  return (
    <Draggable
      draggableId={props.task.id}
      index={props.index}
      isDragDisabled={false}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps} // Applied to part of component that we want to control the drag with. 
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          // isDragDisabled={isDragDisabled}
        >
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic"></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleShow}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
              <Dropdown.Item onClick={handleAssignInTasks}>Assign</Dropdown.Item>
              <Dropdown.Item onClick={handleTransfer}>Transfer</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {props.task.content}

          <Modal
            show={show}
            onHide={() => setShow(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Task</Modal.Title>
            </Modal.Header>
            <textarea className="content" defaultValue={props.task.content}></textarea>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleEditClose}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={assignShow}
            onHide={() => setAssignShow(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Assign Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormControl component="fieldset">
                {props.engagements.length === 0 ? "Your team has not added any engagements yet!" : (
                  <div>
                    <FormLabel component="legend">Engagement</FormLabel>
                    <RadioGroup aria-label="engagement" name="engagement1" value={radioValue} onChange={handleAssignChange}>
                      {props.engagements.map(el => {
                          // const name = el.teamName.toLowerCase() + "_" + el.engName;
                          return <FormControlLabel value={el.engName} control={<Radio />} label={el.engName} />
                      })}
                    </RadioGroup>
                  </div>
                )}
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleAssignInTasks}>
                Assign
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
          show={transferShow}
          onHide={() => setTransferShow(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Transfer Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormControl component="fieldset">
              {props.members.length === 0 ? "Your team has not added any members yet!" : (
                <div>
                  <FormLabel component="legend">Team Members</FormLabel>
                  <RadioGroup aria-label="members" name="members1" value={transfer} onChange={handleTransferChange}>
                    {props.members.map(el => {
                        return <FormControlLabel value={el} control={<Radio />} label={el} />
                    })}
                  </RadioGroup>
                </div>
              )}
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleTransfer}>
              Transfer
            </Button>
          </Modal.Footer>
        </Modal>
        </Container>
      )}
    </Draggable>
  )
}

export default Task;
