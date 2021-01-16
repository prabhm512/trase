import React, { useContext }from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import './ReactDND.css';
import UpdateToDoContext from './UpdateToDoContext';

function NewTask() {
    // Call addNewTask function in ReactDND.js (2 levels up) from here
    const addNewTask = useContext(UpdateToDoContext);
 
    return (
        <div className="addTasks">
            <textarea className="inputNewTaskContent"></textarea>
            <FontAwesomeIcon icon={faTrashAlt} className="cancelTaskButton" onClick={() => {
                document.querySelector(".addTasks").style.display = "none";
            }}></FontAwesomeIcon>
            <FontAwesomeIcon icon={faCalendarCheck} className="addTaskButton" onClick={addNewTask}></FontAwesomeIcon>
        </div>
    )
}

export default NewTask;