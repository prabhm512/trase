import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { getTeamMembers, getOneTeam } from '../../utils/apis/userFunctions';
import { useHistory } from 'react-router-dom';
import './style.css';

function Team() {
    
    const history = useHistory();

    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);

    const [members, setMembers] = useState([]);
    const [engs, setEngs] = useState([]);
    
    useEffect(() => {
        const tempMemberArr = [];
        const tempEngArr = [];

        getTeamMembers(decoded.teamName).then(res => {
            res.forEach(el => {
                tempMemberArr.push({
                    _id: el._id,
                    name: el.first_name + " " + el.last_name
                });
            })
            setMembers(tempMemberArr);
        })

        getOneTeam(decoded.teamName).then(res => {

            res.engagements.forEach(el => {
                tempEngArr.push({ engName: el })
            })
            setEngs(tempEngArr);
        })
    }, [])

    const handleClick = event => {
        const id = event.target.id;
        history.push('/member/' + id);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <h1>{decoded.teamName}</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <ul className="member-list" type="none">
                        {members.map(el => {
                            return <li><button id={el._id} onClick={handleClick}>{el.name}</button></li>
                        })}
                    </ul>
                </div>
            </div>
            <h3>Engagements</h3>
            <div className="row">
                <div className="col-sm-6">
                    <ul className="engagement-list" type="none">
                        {engs.map(el => {
                            return <li>{el.engName}</li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Team;