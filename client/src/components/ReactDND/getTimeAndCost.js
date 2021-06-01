const calculateCost = (empCost, taskTime) => {

    let cost = 0; 

    // cost = Math.round((empCost * taskTime.toFixed(3)) * (10^2)) / (10^2);
    cost = (empCost * taskTime.toFixed(3));
    
    return cost;
}


const getTimeAndCost = (decoded, currentState, draggableId) => {
    let taskTime;
    let totalTaskTime = 0;

    // Calculate exact time (in miilliseconds) that task was in 'In Progress' column
    if (currentState.tasks[draggableId].inProgressDate !== 0) {
        taskTime = Date.now() - currentState.tasks[draggableId].inProgressDate;
    }

    const timeInSeconds = Math.round(taskTime / 1000);
    const timeInHours = (timeInSeconds / 3600).toFixed(3);
    const parsedTimeInHours = parseFloat(timeInHours);

    // Calculate total time it took to complete task
    for (let i=1; i<=Object.keys(currentState.tasks[draggableId].timesheet).length; i++) {
        totalTaskTime += currentState.tasks[draggableId].timesheet[i];
    }
    totalTaskTime+=parsedTimeInHours;

    // Calculate cost of task
    const cost = calculateCost(decoded.empCost, totalTaskTime);

    return {
        parsedTimeInHours: parsedTimeInHours,
        totalTaskTime: totalTaskTime,
        cost: cost
    };
}   

export default getTimeAndCost;