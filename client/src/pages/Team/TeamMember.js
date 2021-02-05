import React from 'react';
import { useParams } from 'react-router-dom'; 
import ReactDND from '../../components/ReactDND/ReactDND';
import './style.css';

function TeamMember() {
    let { userID } = useParams();

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <ReactDND userID={userID}/>
                </div>
            </div>
        </div>
    )
}

export default TeamMember;