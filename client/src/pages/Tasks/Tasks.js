import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import ReactDND from '../../components/ReactDND/ReactDND';
import { updateLoginStatus } from '../../utils/apis/userFunctions';
import './Tasks.css';
import { Button } from "@material-ui/core";
import { useHistory } from 'react-router-dom';

function Tasks(props) {

    const [state, setState] = useState({
        teamName: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        admin: '',
        errors: {}
    })

    const history = useHistory();
    let token = null; 
    let decoded = null;

    if (localStorage.usertoken) {
        token = localStorage.usertoken;
        decoded = jwt_decode(token);
    }

    const handleClick = () => {
        if (decoded !== null) {
            history.push('/timesheet/' + decoded._id);
        } else {
            history.push('/demo/timesheet')
        }
    };
    
    useEffect(() => {
        if (decoded !== null && decoded.firstLogin === true) {
    
            props.handleShowCB();
    
            updateLoginStatus(decoded._id);
        }
    }, []) 

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    {decoded === null ? (
                        <div>
                            <h1 className="loggedInUserName">Jane Doe</h1>
                            <br></br>
                            <ReactDND userID={null} />
                        </div>
                    ): (
                        <div>
                            <h1 className="loggedInUserName">
                                { decoded.first_name } { decoded.last_name }
                            </h1>
                            <br></br>
                            <ReactDND userID={ decoded._id } />
                        </div>
                    )}
                    <Button onClick={handleClick} className="timesheetButton" style={{marginBottom: 40}} variant="contained" color="primary">Timesheet</Button>
                </div>
            </div>
        </div>
    ) 
}

export default Tasks;