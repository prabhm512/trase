import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import ReactDND from '../../components/ReactDND/ReactDND';
import { updateLoginStatus } from '../../utils/apis/userFunctions';
import './Tasks.css';
import { Button } from "@material-ui/core";

class Tasks extends Component {
    constructor() {
        super()
        this.state = {
            teamName: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            admin: '',
            errors: {}
        }
    }
    token = localStorage.usertoken;
    decoded = jwt_decode(this.token);

    handleClick = () => {
        this.props.history.push('/timesheet/' + this.decoded._id);
    };
    
    componentDidMount() {

        if (this.decoded.firstLogin === true) {

            this.props.handleShowCB();

            updateLoginStatus(this.decoded._id);
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        {/* <h1 className="team">Team <em>{this.decoded.teamName}</em></h1> */}
                        <h1 className="loggedInUserName">
                            { this.decoded.first_name } { this.decoded.last_name }
                        </h1>
                        <br></br>
                        <ReactDND userID={ this.decoded._id } />
                        <br></br>
                        <Button onClick={this.handleClick} className="timesheetButton" style={{marginBottom: 40}} variant="contained" color="primary">Timesheet</Button>
                    </div>
                </div>
            </div>
        ) 
    }
}

export default Tasks;