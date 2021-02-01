import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Modal, Button } from 'react-bootstrap';

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

  const handleClose = event => { 
    setShow(false);

    // New content of task
    const editedContent = document.querySelector(".content").value;
    props.editTaskContentCB(props.task.id, editedContent);
  };

  const handleShow = () => setShow(true);

  const handleDelete = () => {
    props.deleteTaskCB(props.task.id);
  }

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
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              ...
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleShow}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
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
              <Button variant="secondary" onClick={handleClose}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      )}
    </Draggable>
  )
}

export default Task;
