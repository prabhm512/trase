import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { getOneTeam } from '../../utils/apis/userFunctions';
import API from '../../utils/apis/API';
import './style.css';
import EngAccordion from './Accordion';

function Team() {

    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    const [engs, setEngs] = useState([]);
    
    let tempEngArr = [];

    const storeEngagementNames = () => {

        // Store content of each task with the same engagement name
        getOneTeam(decoded.teamName).then(res => {

            res.engagements.forEach(eng => {
                tempEngArr.push({ engName: eng, tasks: [] });
            })
        }).then(() => {
            renderEngagements();
        }).then(() => {
            setEngs(tempEngArr);
        })
    }
    
    const renderEngagements = async () => {
        await API.getBoards().then(response => {    
                response.data.forEach(el => {
                    if (el.teamName === decoded.teamName) {
                        for (let key in el.tasks) {
                            if (el.tasks[key].engagement !== "") {
                                tempEngArr.map((eng, idx) => {
                                    if (eng.engName === el.tasks[key].engagement) {
                                        // tempEngArr[idx].tasks.push(el.tasks[key].content);
                                        tempEngArr[idx].tasks.push(el.tasks[key].content);
                                    }
                                })
                            }
                        }
                    }
                })
            })  
    }

    useEffect(() => {
        storeEngagementNames()

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
                            // const name = Object.keys(el);
                            return <li><EngAccordion key={idx} name={el.engName} tasks={[el.tasks]}></EngAccordion></li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Team;