import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import ReactDND from '../components/ReactDND/ReactDND';
import API from '../utils/apis/API';
import initialData from '../components/ReactDND/initial-data';

class Home extends Component {
    // constructor() {
    //     super()
    //     this.state = {
    //         _id: '',
    //         first_name: '',
    //         last_name: '',
    //         email: '',
    //         password: ''
    //     }
    // }
    token = localStorage.usertoken;
    decoded = jwt_decode(this.token);

    handleClick = () => {
        this.props.history.push('/timesheet/' + this.decoded._id);
    };

    componentDidMount() {
 
        // this.setState({
        //     _id: this.decoded._id,
        //     first_name: this.decoded.first_name,
        //     last_name: this.decoded.last_name,
        //     email: this.decoded.email
        // })
        // console.log(this.decoded._id);
        // Create a new user board only if it does not exist
        API.getUserBoard(this.decoded._id).then(res => {
            // console.log(res);
            if (res.data === null) {
                initialData._id = this.decoded._id;
                API.createBoard(initialData).catch(err => console.log(err));
            }
        })
    }

    render() {
        return (
            <div className="home">
                <h1>
                    Welcome { this.decoded.first_name } { this.decoded.last_name }
                </h1>
                <ReactDND userID={ this.decoded._id }></ReactDND>
                <button onClick={this.handleClick}>Timesheet</button>
            </div>
        ) 
    }
}

export default Home;