import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import ReactDND from '../../components/ReactDND/ReactDND';
import { updateLoginStatus } from '../../utils/apis/userFunctions';
import './Tasks.css';
import { Button } from "@material-ui/core";
import { useHistory } from 'react-router-dom';

function Tasks(props) {

    // const [state, setState] = useState({
    //     teamName: '',
    //     first_name: '',
    //     last_name: '',
    //     email: '',
    //     password: '',
    //     admin: '',
    //     errors: {}
    // })

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

    const handleEngClick = () => {
        history.push('/demo/engagements');
    }
    
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
                            <Button onClick={handleEngClick} className="engButton" style={{marginBottom: 40, marginLeft: 10}} variant="contained" color="primary">Engagements</Button>
                            <Button onClick={handleClick} className="timesheetButton" style={{marginBottom: 40}} variant="contained" color="primary">Timesheet</Button>
                            <div>
                                <h4 className="instructions"><i>Instructions</i></h4>
                                <h5>Time a Task</h5>
                                <ol>
                                    <li>Add a task by clicking on the + icon in the 'To Do' column</li>
                                    <li>Drag the task into the 'In Progress' column to start time monitoring</li>
                                    <li>Drag this task into the 'Paused' or 'Done' columns to stop time monitoring</li>
                                    <li>Click on the 'Timesheet' button</li>
                                </ol>
                                <h5>Assign Task to an Engagement</h5>
                                <ol>
                                    <li>Click on the coral button that is shown on the top right of each task</li>
                                    <li>Click the 'Assign' option, select an engagement, then click 'Assign'</li>
                                    <li><b>Task must be timed for its cost to be shown on the engagements page</b></li>
                                    <li>Click on the 'Engagements' button</li>
                                </ol>
                            </div>
                        </div>
                    ): (
                        <div>
                            <h1 className="loggedInUserName">
                                { decoded.first_name } { decoded.last_name }
                            </h1>
                            <br></br>
                            <ReactDND userID={ decoded._id } />
                            <Button onClick={handleClick} className="timesheetButton" style={{marginBottom: 40}} variant="contained" color="primary">Timesheet</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) 
}

export default Tasks;