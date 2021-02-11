import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import ReactDND from '../../components/ReactDND/ReactDND';
import { updateLoginStatus } from '../../utils/apis/userFunctions';
import './Tasks.css';

class Home extends Component {
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
        this.props.history.push('/timesheet/' + this.decoded.teamName + '/' + this.decoded._id);
    };
    
    componentDidMount() {

        if (this.decoded.firstLogin === true) {

            this.props.handleShowCB();

            updateLoginStatus(this.decoded._id);
        }
    }

    render() {
        return (
            <div className="home">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            {/* <h1 className="team">Team <em>{this.decoded.teamName}</em></h1> */}
                            <h1>
                                Welcome { this.decoded.first_name } { this.decoded.last_name }
                            </h1>
                            <ReactDND userID={ this.decoded._id } />
                            <button onClick={this.handleClick}>Timesheet</button>
                        </div>
                    </div>
                </div>
            </div>
        ) 
    }
}

export default Home;