import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { getTeamMembers } from '../../utils/apis/userFunctions';
import { Link, withRouter } from "react-router-dom";
import {List, ListItem, ListItemText} from '@material-ui/core';


function Team() {
    
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);

    const [members, setMembers] = useState([]);
    const tempMembersArray = []
    
    useEffect(() => {
        getTeamMembers(decoded.teamName).then(res => {
            res.forEach(el => {
                tempMembersArray.push(el.first_name);
            })
            setMembers(tempMembersArray);
        })
    })

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <h1>{decoded.teamName}</h1>
                    <ul>
                        {members.map(el => {
                            return <li>{el}</li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Team);