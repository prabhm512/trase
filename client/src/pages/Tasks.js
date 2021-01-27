import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import ReactDND from '../components/ReactDND/ReactDND';
// import { useHistory } from 'react-router-dom';

class Home extends Component {
    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        }
    }
    // const history = useHistory();
    
    handleClick = () => {
        this.props.history.push('/timesheet');
    };

    componentDidMount() {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            email: decoded.email
        })
    }

    render() {
        return (
            <div className="home">
                <h1>
                        Welcome { this.state.first_name } { this.state.last_name }
                </h1>
                <ReactDND></ReactDND>
                <button onClick={this.handleClick}>Timesheet</button>
            </div>
        ) 
    }
}

export default Home;