import React, { useEffect } from 'react';
import API from '../../utils/apis/API';
import { startOfWeek, endOfWeek } from 'date-fns';
import { useLocation } from 'react-router-dom';
import './Timesheet.css';

function Timesheet() {
    // const dayToday = new Date().getDay();

    // ID of the users unique board is extracted from the location pathname
    const location = useLocation();

    const renderTasks = () => {
        API.getUserBoard(location.pathname.substr(11))
            .then(res => {
                // Clear innerHTML before adding it again 
                document.querySelector(".timesheet-body").innerHTML = "";

                let totalTimeMon = 0;
                let totalTimeTues = 0;
                let totalTimeWed = 0;
                let totalTimeThurs = 0;
                let totalTimeFri = 0;

                // Loop through initial data to find out content & time of each task
                // Add this data to table
                for (let key in res.data.tasks) {

                    if (res.data.tasks.hasOwnProperty(key)) {
                        if (key === 'task-1') {
                            continue;
                        } else {
                            let newTableRow = `
                            <tr>
                                <th>${res.data.tasks[key].content}</th>
                            `;
    
                            for (let i=1; i<6; i++) {
                                if (res.data.tasks[key].timesheet[i] === 0) {
                                    newTableRow += `<td></td>`;
                                } else {
                                    newTableRow += `<td>${res.data.tasks[key].timesheet[i]}</td>`;
                                }
                            }
                            
                            newTableRow += '</tr>';
                            
                            document.querySelector(".timesheet-body").innerHTML += newTableRow;
    
                            // Calculate the total time the employee for each day
                            totalTimeMon += parseInt(res.data.tasks[key].timesheet[1]);
                            totalTimeTues += parseInt(res.data.tasks[key].timesheet[2]);
                            totalTimeWed += parseInt(res.data.tasks[key].timesheet[3]);
                            totalTimeThurs += parseInt(res.data.tasks[key].timesheet[4]);
                            totalTimeFri += parseInt(res.data.tasks[key].timesheet[5]);
                        }
                    }
                }

                const newRowForTotals = `
                <tr>
                    <th class=totals><em>Total</em></th>
                    <td id=total-1>${totalTimeMon}</td>
                    <td id=total-2>${totalTimeTues}</td>
                    <td id=total-3>${totalTimeWed}</td>
                    <td id=total-4>${totalTimeThurs}</td>
                    <td id=total-5>${totalTimeFri}</td>
                </tr>`;

                document.querySelector(".timesheet-body").innerHTML += newRowForTotals;
            })
    }

    const renderDates = () => {
        document.querySelector(".dates").innerHTML = "";
        document.querySelector(".dates").innerHTML += '<th scope="col"></th>';

        const date = new Date();

        // Make sure that only dates from Mon-Fri get rendered every time component is mounted
        const weekStart = startOfWeek(date, { weekStartsOn: 1 }).getDate();
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 }).getDate() - 2;

        for (let i=weekStart; i<=weekEnd; i++) {
            const tableHeading = `<th>${i + '/' + (date.getMonth() + 1)}</th>`;

            document.querySelector(".dates").innerHTML += tableHeading;
        }
    };
    
    useEffect(() => {
        renderTasks();
        renderDates();
    });

    return (
        <div className="timesheet">
            <h1>Timesheet</h1>
            <table className="table">
                <thead>
                    <tr className="dates"></tr>
                </thead>
                <tbody className="timesheet-body"></tbody>
            </table>
        </div>
    )
}

export default Timesheet;