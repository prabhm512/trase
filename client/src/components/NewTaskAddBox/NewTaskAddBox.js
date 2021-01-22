import React, { useContext }from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import './NewTaskAddBox.css';
import UpdateToDoContext from '../../utils/contexts/UpdateToDoContext';

function NewTask() {
    // Call addNewTask function in ReactDND.js (2 levels up) from here
    const addNewTask = useContext(UpdateToDoContext);

    return (
        // Textarea where users can add new tasks to the 'To Do' list
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