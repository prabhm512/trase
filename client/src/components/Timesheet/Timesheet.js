import React, { useEffect } from 'react';
import API from '../../utils/apis/API';
import { startOfWeek, endOfWeek } from 'date-fns';
import './Timesheet.css';

function Timesheet() {

    const renderTasks = () => {
        API.getTasks()
            .then(res => {
                // Clear innerHTML before adding it again 
                document.querySelector(".timesheet-body").innerHTML = "";

                // Loop through initial data to find out content & time of each task
                // Add this data to table
                for (let key in res.data[0].tasks) {
                    const dayToday = new Date().getDay();
                    if (res.data[0].tasks.hasOwnProperty(key)) {

                        let newTableRow = `
                        <tr>
                            <th>${res.data[0].tasks[key].content}</th>
                        `;

                        for (let i=1; i<6; i++) {
                            
                            if (i === dayToday) {
                                newTableRow += `<td>${res.data[0].tasks[key].time}</td>`;
                            } else {
                                newTableRow += `<td></td>`;
                            }
                        }
                        
                        newTableRow += '</tr>';

                        document.querySelector(".timesheet-body").innerHTML += newTableRow;
                    }
                }
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
    }, []);

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