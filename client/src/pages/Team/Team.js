import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { getOneTeam } from '../../utils/apis/userFunctions';
import './style.css';
import EngAccordion from './Accordion';

function Team() {

    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    const [engs, setEngs] = useState([]);
    
    useEffect(() => {
        const tempEngArr = [];

        getOneTeam(decoded.teamName).then(res => {

            res.engagements.forEach(el => {
                tempEngArr.push({ engName: el, teamName: decoded.teamName })
            })
            setEngs(tempEngArr);
        })
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
                        {engs.map(el => {
                            const name = el.teamName.toLowerCase() + "_" + el.engName;
                            return <li><EngAccordion name={name} /></li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Team;