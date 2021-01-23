import React, { useEffect } from 'react';
import API from '../../utils/apis/API';

function Timesheet() {

    const renderTasks = () => {
        API.getTasks()
            .then(res => {
                // Loop through initial data to find out value of last key
                for (let key in res.data[0].tasks) {
                    if (res.data[0].tasks.hasOwnProperty(key)) {

                        const newTableRow = `
                        <tr>
                            <th>${res.data[0].tasks[key].content}<th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>`;

                        document.querySelector(".timesheet-body").innerHTML += newTableRow;
                    }
                }
            })
    }
    useEffect(() => {
        renderTasks();
    })

    return (
        <div className="timesheet">
            <h1>Timesheet</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Mon</th>
                        <th scope="col">Tues</th>
                        <th scope="col">Wed</th>
                        <th scope="col">Thurs</th>
                        <th scope="col">Fri</th>
                    </tr>
                </thead>
                <tbody className="timesheet-body"></tbody>
            </table>
        </div>
    )
}

export default Timesheet;