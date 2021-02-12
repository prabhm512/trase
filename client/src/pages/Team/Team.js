import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { getOneTeam } from '../../utils/apis/userFunctions';
import API from '../../utils/apis/API';
import './style.css';
// import EngAccordion from './Accordion';
import MyDocument from './engagementPDF';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { startOfWeek, endOfWeek } from 'date-fns';

function Team() {

    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);

    const [engs, setEngs] = useState([]);

    const dateToday = new Date();
    const month = dateToday.getMonth() + 1;
    const fullDate = dateToday.getDate() + '/' + month + '/' + dateToday.getFullYear();

    // Show different report based on which button is clicked
    const [showReport, setShowReport] = useState({
        name: '',
        tasks: {},
        weekStart: '', 
        weekEnd: '',
        view: false
    });
    
    let tempEngArr = [];

    const storeEngagementNames = () => {

        // Store content of each task with the same engagement name
        getOneTeam(decoded.teamName).then(res => {

            res.engagements.forEach(eng => {
                tempEngArr.push({ engName: eng, tasks: {} });
            })
        }).then(() => {
            renderEngagements();
        }).then(() => {
            setEngs(tempEngArr);
        })
    }
    
    const renderEngagements = () => {
        API.getBoards().then(response => {    
            response.data.forEach(el => {
                if (el.teamName === decoded.teamName) {
                    for (let key in el.tasks) {
                        if (el.tasks[key].engagement !== "") {
                            tempEngArr.map((eng, idx) => {
                                if (eng.engName === el.tasks[key].engagement) {
                                    // tempEngArr[idx].tasks.push(el.tasks[key].content);
                                    tempEngArr[idx].tasks = {
                                        ...tempEngArr[idx].tasks,
                                        [el.tasks[key].id]: { employees: { ...el.tasks[key].employees }, content: el.tasks[key].content }
                                    }
                                }
                            })
                        }
                    }
                }
            })
        })  
    }

    const renderClickedEngReport = event => {
        event.preventDefault();
        
        let tasks = {};

        const date = new Date();

        const weekStart = startOfWeek(date, { weekStartsOn: 1 }).getDate() + '/' + month + '/' + date.getFullYear();
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 }).getDate() - 2 + '/' + month + '/' + date.getFullYear();

        engs.forEach(el => {
            if (el.engName === event.target.id) {
                tasks = {
                    ...el.tasks
                };
            }
        })
        setShowReport({
            name: event.target.id,
            tasks: tasks,
            weekStart: weekStart, 
            weekEnd: weekEnd,
            view: true
        })
    }

    useEffect(() => {
        storeEngagementNames();
    }, [])

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <h1>{decoded.teamName}</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <h3>Engagements</h3>
                    <ul className="engagement-list" type="none">
                        {engs.map((el, idx) => {
                            // return <li><EngAccordion key={idx} name={el.engName} tasks={[el.tasks]} /></li>
                            return <li><button id={el.engName} onClick={renderClickedEngReport}>{el.engName}</button></li>
                        })}
                    </ul>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    {showReport.view ? ( <div>
                        <h3>{showReport.name.toUpperCase()} Report</h3>
                        <PDFViewer className="pdfViewer">
                            <MyDocument name={showReport.name.toUpperCase()} tasks={showReport.tasks} weekStart={showReport.weekStart} weekEnd={showReport.weekEnd}/>
                        </PDFViewer>
                        <br></br>
                        <PDFDownloadLink className="btn btn-primary pdfDownloadLink" document={<MyDocument name={showReport.name.toUpperCase()} tasks={showReport.tasks} weekStart={showReport.weekStart} weekEnd={showReport.weekEnd}/>} fileName={showReport.name + '-' + fullDate + '.pdf'}>
                            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : `Download`)}
                        </PDFDownloadLink>
                        </div> ) : ''}
                </div>
            </div>
        </div>
    )
}

export default Team;