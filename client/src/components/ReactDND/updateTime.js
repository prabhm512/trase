const updateStatecurrentState = (start, finish, draggableId, currentState, newStart, newFinish, parsedTimeInHours = 0, decoded = {}, totalTaskTime = 0, cost = 0) => {

    // Used when task is moved in to the 'Puased' & 'Done' columns to record time for current day.
    // One task may be worked on for multiple days
    let dayToday = new Date().getDay();

    let newState;
    

    if (finish.id === 'column-2') {
        newState = {
            ...currentState, 
            tasks: { 
                ...currentState.tasks,
                [draggableId]: { ...currentState.tasks[draggableId], inProgressDate: Date.now() }
            },
            columns: {
                ...currentState.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }
    }

    else if (finish.id === 'column-3' && start.id === 'column-2') {
        newState = {
            ...currentState, 
            tasks: { 
                ...currentState.tasks,
                [draggableId]: { ...currentState.tasks[draggableId], pausedDate: Date.now(), timesheet: { ...currentState.tasks[draggableId].timesheet, [`${dayToday}`]: currentState.tasks[draggableId].timesheet[dayToday] + parsedTimeInHours }, employees: { ...currentState.tasks[draggableId].employees, [decoded.email]: { email: decoded.email, overallTime: totalTaskTime.toFixed(3), cost: cost }} }
            },
            columns: {
                ...currentState.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }
    }

    else if (finish.id === 'column-4'  && start.id === 'column-2') {
        newState = {
            ...currentState, 
            tasks: { 
                ...currentState.tasks,
                [draggableId]: { ...currentState.tasks[draggableId], doneDate: Date.now(), timesheet: { ...currentState.tasks[draggableId].timesheet, [`${dayToday}`]: currentState.tasks[draggableId].timesheet[dayToday] + parsedTimeInHours }, employees: { ...currentState.tasks[draggableId].employees, [decoded.email]: { email: decoded.email, overallTime: totalTaskTime.toFixed(3), cost: cost }} }
            },
            columns: {
                ...currentState.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }
    }

    console.log(newState);
    return newState;
}

export default updateStatecurrentState;