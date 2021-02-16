import React from "react";
import "./style.css";
import tasksImg from "../../assets/tasks.png";
import timesheetImg from "../../assets/timesheet.png";
import engagementsImg from "../../assets/engagements.png";


export default function Landing() {

    return(
        <div>
            <div className='header'>
                <span className='header-title'>
                    TRASE
                </span>
                <br/>
                <span className="header-text">
                    Automated Time and Cost Management
                </span>
            </div>
            <br></br>
            <div className="container-sm landingPage">
                <div className="row taskBoard">
                    {/* <div className="col-sm-3"></div> */}
                    <div className="col-sm-8">
                        <h4>Employees manage their tasks on a personalised Kanban.</h4>
                        <img src={tasksImg} className="image tasksImg" alt="task board" />
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <br></br>
                <div className="row timesheet">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-8">
                        <h4>Employee timesheets get filled based on the status of their tasks.</h4>
                        <img src={timesheetImg} className="image timesheetImg" alt="timesheet" />
                    </div>
                </div>
                <br></br>
                <div className="row engagementView">
                    {/* <div className="col-sm-4"></div> */}
                    <div className="col-sm-8">
                        <h4>All tasks done by your team are collated and a report is available for export as PDF.</h4>
                        <img src={engagementsImg} className="image engagementsImg" alt="engagement report" />
                    </div>
                </div>
            </div>
        </div>
    );
}
