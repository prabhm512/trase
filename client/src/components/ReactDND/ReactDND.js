import React, { useEffect, useState } from 'react';

// react-beautiful-dnd
import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

// Utils
import UpdateToDoContext from '../../utils/contexts/UpdateToDoContext';
import API from '../../utils/apis/API';
import { getOneTeam, getTeamMembers, getOneUser } from '../../utils/apis/userFunctions';
import jwt_decode from 'jwt-decode';
import uniqid from 'uniqid';

// Styling
import styled from 'styled-components';
import './ReactDND.css';
import { decode } from 'jsonwebtoken';

const Container = styled.div`
  display:flex;
`

function ReactDND(props) {

  // Used when task is moved in to the 'Puased' & 'Done' columns to record time for current day.
  // One task may be worked on for multiple days
  let dayToday = new Date().getDay();
  let token, decoded;

  if (localStorage.usertoken) {
      token = localStorage.usertoken;
      decoded = jwt_decode(token);
  } else {
    decoded = {
      teamName: 'Doe Consulting',
      email: 'jane@doeconsulting.com',
      empCost: 100
    }
  }

  initialData.teamName = decoded.teamName;
  const [ DND, setDND ] = useState(initialData);

  // List of all enagagements of the team that the logged in user works for
  const [engs, setEngs] = useState([]);

  // List of all members in team
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (decoded.email !== 'jane@doeconsulting.com') {
      if (sessionStorage.traseDemo) {
        sessionStorage.removeItem("traseDemo");
      }
      // Load tasks on component mount
      loadTasks(props.userID);
  
      // Store all engagements of the logged in user's team
      getOneTeam(decoded.teamName).then(res => {
        const tempEngArr = [];
  
        res.engagements.forEach(el => {
          tempEngArr.push({ engName: el })
        })
        setEngs(tempEngArr);
      })
  
      getTeamMembers(decoded.teamName).then(res => {
  
        const tempMembersArr = [];
  
        res.forEach(el => {
          if (el.email !== decoded.email) {
            tempMembersArr.push(el.email);
          }
        })
        setMembers(tempMembersArr);
      })
    } else {
      if (sessionStorage.traseDemo) {
        const demoDND = JSON.parse(sessionStorage.getItem("traseDemo"));
        setDND(demoDND);
      }

      setEngs([{ engName: 'lorem'}, {engName: 'ipsum'}]);
      setMembers(['john@doeconsulting.com', 'james@doeconsulting.com']);
    }
  }, []);
  
  // Updates state to reflect drag & drop result
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
      const updatedTaskIds = Array.from(start.taskIds)
      updatedTaskIds.splice(source.index, 1)
      updatedTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: updatedTaskIds
      }

      const newState = {
        ...DND,
        columns: {
          ...DND.columns,
          [newColumn.id]: newColumn
        }
      }

      // Do not set state inside method that does an axios call as task movement lags.
      setDND(newState);
      if (decoded.email !== 'jane@doeconsulting.com') {
        API.updateUserBoard(newState);
      } else {
        sessionStorage.setItem("traseDemo", JSON.stringify(newState));
      }
      return
    }

    // Moving tasks from 1 column to another
    // Do not allow task to move back to 'To Do' column once it has been moved out
    if ((start.id !== 'column-2' || start.id !== 'column-3' || start.id !== 'column-4') && finish.id !== 'column-1') {
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
    
      let newState = {
        ...DND,
        columns: {
          ...DND.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      }

      // Record the date task was moved into 'In Progress' column
      if (finish.id === 'column-2') {

        newState = {
          ...DND, 
          tasks: { 
            ...DND.tasks,
            [draggableId]: { ...DND.tasks[draggableId], inProgressDate: Date.now() }
          },
          columns: {
            ...DND.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
          }
        }
      } 

      // Record the date task was moved FROM 'In Progress' column into 'Paused' column 
      else if (finish.id === 'column-3' && start.id === 'column-2')  {

        let taskTime;
        let totalTaskTime = 0;

        // Calculate exact time (in miilliseconds) that task was in 'In Progress' column
        if (DND.tasks[draggableId].inProgressDate !== 0) {
          taskTime = Date.now() - DND.tasks[draggableId].inProgressDate;
        }

        const timeInSeconds = Math.round(taskTime / 1000);
        const timeInHours = (timeInSeconds / 3600).toFixed(3);
        const parsedTimeInHours = parseFloat(timeInHours);
      
        // Calculate total time it took to complete task
        for (let i=1; i<6; i++) {
          totalTaskTime += DND.tasks[draggableId].timesheet[i];
        }
        totalTaskTime+=parsedTimeInHours;

        // Calculate cost of task
        const cost = calculateCost(decoded.empCost, totalTaskTime);

        newState = {
          ...DND, 
          tasks: { 
            ...DND.tasks,
            [draggableId]: { ...DND.tasks[draggableId], pausedDate: Date.now(), timesheet: { ...DND.tasks[draggableId].timesheet, [`${dayToday}`]: DND.tasks[draggableId].timesheet[dayToday] + parsedTimeInHours }, employees: { ...DND.tasks[draggableId].employees, [decoded.email]: { email: decoded.email, overallTime: totalTaskTime, cost: cost }} }
          },
          columns: {
            ...DND.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
          }
        }

      }

      // Record the date task was moved FROM 'In Progress' column into 'Done' column 
      else if (finish.id === 'column-4'  && start.id === 'column-2') {

        let taskTime;
        let totalTaskTime=0;

        // Calculate exact time (in miilliseconds) that task was in 'In Progress' column
        if (DND.tasks[draggableId].inProgressDate !== 0) {
          taskTime = Date.now() - DND.tasks[draggableId].inProgressDate;
        }

        const timeInSeconds = Math.round(taskTime / 1000);
        const timeInHours = (timeInSeconds / 3600).toFixed(3);
        const parsedTimeInHours = parseFloat(timeInHours);

        // Calculate total time it took to complete task
        for (let i=1; i<6; i++) {
          totalTaskTime += DND.tasks[draggableId].timesheet[i];
        }
        totalTaskTime+=parsedTimeInHours;

         // Calculate cost of task
        const cost = calculateCost(decoded.empCost, totalTaskTime); 

        newState = {
          ...DND, 
          tasks: { 
            ...DND.tasks,
            [draggableId]: { ...DND.tasks[draggableId], doneDate: Date.now(), timesheet: { ...DND.tasks[draggableId].timesheet, [`${dayToday}`]: DND.tasks[draggableId].timesheet[dayToday] + parsedTimeInHours }, employees: { ...DND.tasks[draggableId].employees, [decoded.email]: { email: decoded.email, overallTime: totalTaskTime, cost: cost }} }
          },
          columns: {
            ...DND.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
          }
        }

      }
      // console.log(newState);
      // Do not set state inside method that does an axios call as task movement lags.
      setDND(newState);
      if (decoded.email !== 'jane@doeconsulting.com') {
        API.updateUserBoard(newState);
      } else {
        sessionStorage.setItem("traseDemo", JSON.stringify(newState));
      }
    }
  } 

  // Add new task to To do list 
  const addNewTask = () => {
    let newTaskID = uniqid();

    if (document.querySelector('.inputNewTaskContent').value !== "") {

      // Add new task
      // New timer instantiated on creation of new task
      DND.tasks[newTaskID] = { id: newTaskID, content: document.querySelector('.inputNewTaskContent').value, inProgressDate: 0, pausedDate: 0, doneDate: 0, timesheet: {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0,'6': 0, '7': 0}, engagement: '', employees: {}, transferred: false };

      // ID of new task gets inserted into first column
      const newToDos = {
        _id: props.userID,
        tasks: { ...DND.tasks },
        columns: {
          'column-1': {
            id: 'column-1',
            title: 'To Do',
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
        columnOrder: [...DND.columnOrder],
        teamName: decoded.teamName,
        transferredTasks: { ...DND.transferredTasks },
        empCost: decoded.empCost
      }
      // Do not set state inside method that does an axios call as task movement lags.
      setDND(newToDos);
      if (decoded.email !== 'jane@doeconsulting.com') {
        API.updateUserBoard(newToDos);
      } else {
        sessionStorage.setItem("traseDemo", JSON.stringify(newToDos));
      }

      // console.log(newToDos);
      document.querySelector('.inputNewTaskContent').value = "";
    }
  }

  const calculateCost = (empCost, taskTime) => {

    let cost = 0; 

    cost = Math.round((empCost * taskTime) * (10^2)) / (10^2);
    
    return cost;
  }

  // Called from component inside task.js (2 levels down). Allows task content to be edited
  const editTaskContent = (taskID, content) => {
    const newState = {
      ...DND, 
      tasks: {
        ...DND.tasks,
        [taskID]: { ...DND.tasks[taskID], content: content }
      }
    }

    setDND(newState);
    if (decode.email !== 'jane@doeconsulting.com') {
      API.updateUserBoard(newState);
    } else {
      sessionStorage.setItem("traseDemo", JSON.stringify(newState));
    }
  }

  // Called from component inside task.js (2 levels down). Allows task to be deleted
  // Second parameted optional because it is only needed when task is being transferred
  const deleteTask = (taskID, newStateForLoggedInUser = 0) => {
    let newState = {};
    // console.log(taskID);
    delete DND.tasks[taskID];

    // Delete task from columns object as well
    for (let key in DND.columns) {
      DND.columns[key].taskIds.forEach((el, idx) => {
        if (el === taskID) {
          DND.columns[key].taskIds.splice(idx, 1);
        }
      })
    }

    if (newStateForLoggedInUser === 0) {
      newState = {
        ...DND
      };
    } 
    else {
      newState = {
        ...newStateForLoggedInUser
      }
    }

    setDND(newState);
    if (decoded.email !== 'jane@doeconsulting.com') {
      API.updateUserBoard(newState);
    } else {
      sessionStorage.setItem("traseDemo", JSON.stringify(newState));
    }
  }

  // Get all tasks of the logged in user
  const loadTasks = (userID) => {
    // console.log(userID);
    API.getUserBoard(userID)
    .then(res => {
      // console.log(res);
      setDND(res.data)
    })
    .catch(err => console.log(err));
  }

  const handleAssign = (taskID, radioValue) => {
    const newState = {
      ...DND, 
      tasks: {
        ...DND.tasks,
        [taskID]: { ...DND.tasks[taskID], engagement: radioValue }
      }
    }

    setDND(newState);
    if (decoded.email !== 'jane@doeconsulting.com') {
      API.updateUserBoard(newState);
    } else {
      sessionStorage.setItem("traseDemo", JSON.stringify(newState));
    }
  }

  const handleTransfer = (taskID, transferEmail) => {
    if (decoded.email !== 'jane@doeconsulting.com') {
      getOneUser({email: transferEmail}).then(response => {
        API.getUserBoard(response[0]._id).then(res => {
  
          // Disable drag for task that is being transferred on logged in users board
          const newStateForLoggedInUser = {
            ...DND,
            transferredTasks: {
              ...DND.transferredTasks,
              [taskID]: { id: taskID, content: DND.tasks[taskID].content, transferredToId: res.data._id, transferredToEmail: transferEmail, timesheet: {...DND.tasks[taskID].timesheet} }
            }
          }
  
          const newStateForTransferUser = {
            ...res.data,
            _id: res.data._id, 
            tasks: { [taskID]: {
              id: taskID, 
              content: DND.tasks[taskID].content, 
              inProgressDate: 0, 
              pausedDate: 0, 
              doneDate: 0, 
              timesheet: {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0}, 
              engagement: DND.tasks[taskID].engagement, 
              employees: { ...DND.tasks[taskID].employees },
              transferred: false,
            }, ...res.data.tasks },
            columns: {
              'column-1': {
                id: 'column-1',
                title: 'To Do',
                taskIds: [taskID, ...res.data.columns['column-1'].taskIds]
              },
              'column-2': {
                id: res.data.columns['column-2'].id,
                title: res.data.columns['column-2'].title,
                taskIds: [...res.data.columns['column-2'].taskIds]
              },
              'column-3': {
                id: res.data.columns['column-3'].id,
                title: res.data.columns['column-3'].title,
                taskIds: [...res.data.columns['column-3'].taskIds]
              },
              'column-4': {
                id: res.data.columns['column-4'].id,
                title: res.data.columns['column-4'].title,
                taskIds: [...res.data.columns['column-4'].taskIds]
              }
            }
          }
  
          // Delete task from logged in users board
          // This also updates the transferred object of the logged in users board
          deleteTask(taskID, newStateForLoggedInUser);
  
          // Update board of user who the task is beign transferred to
          API.updateUserBoard(newStateForTransferUser);
  
        })
      })
    } else {
        const newStateForLoggedInUser = {
          ...DND,
          transferredTasks: {
            ...DND.transferredTasks,
            [taskID]: { id: taskID, content: DND.tasks[taskID].content, transferredToEmail: transferEmail, timesheet: {...DND.tasks[taskID].timesheet} }
          }
        }
        deleteTask(taskID, newStateForLoggedInUser);
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
              <Column column={column} tasks={tasks} userID={props.userID} currState={DND} editTaskContentCB={editTaskContent} deleteTaskCB={deleteTask} handleAssignCB={handleAssign} engagements={engs} members={members} handleTransferCB={handleTransfer}/>
            </UpdateToDoContext.Provider>
          )
        })}
      </Container>
    </DragDropContext>
  )
}

export default ReactDND;
