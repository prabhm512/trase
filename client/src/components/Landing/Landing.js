import React from "react";
import "./Landing.css";
import tasksImg from "../../assets/tasks.png";
import timesheetImg from "../../assets/timesheet.png";
import engagementsImg from "../../assets/engagements.png";
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';


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
                <br></br>
            </div>
            <br></br>
            <div className="container landingPage">
                <div className="row taskBoard">
                    <div className="col-sm-12">
                        <Link to="/demo/tasks" style={{textDecoration: 'none'}}><Button variant="contained" color="secondary">Try it out for free</Button></Link>
                    </div>
                </div>
                <br></br>
                <div className="row timesheet">
                    <div className="col-xl-6">
                        <h5>Employees manage tasks on a personalised Kanban.</h5>
                        <img src={tasksImg} className="image tasksImg" alt="task board" />
                    </div>
                    <div className="col-xl-6">
                        <h5>Employee timesheets auto-filled based on task status.</h5>
                        <img src={timesheetImg} className="image timesheetImg" alt="timesheet" />
                    </div>
                </div>
                <br></br>
                <div className="row engagementView">
                    <div className="col-xl-3"></div>
                    <div className="col-xl-9">
                        <h5>Weekly client reports available for export as PDF.</h5>
                        <img src={engagementsImg} className="image engagementsImg" alt="engagement report" />
                    </div>
                </div>
            </div>
        </div>
    );
}
