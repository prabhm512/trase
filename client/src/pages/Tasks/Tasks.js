import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import ReactDND from '../../components/ReactDND/ReactDND';
import API from '../../utils/apis/API';
import { registerUser, getUsers, updateLoginStatus } from '../../utils/apis/userFunctions';
import initialData from '../../components/ReactDND/initial-data';
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
            firstLogin: '',
            errors: {}
        }
    }
    token = localStorage.usertoken;
    decoded = jwt_decode(this.token);

    handleClick = () => {
        this.props.history.push('/timesheet/' + this.decoded._id);
    };

    handleValidation = () => {
        let errors = {};
        let formIsValid = true;

        // email
        const inputEmail = this.state.email;
        const emailRegex = /^\w+([\.-]?\w+)*@[a-z]+([\.-]?[a-z]+)*(\.[a-z]{2,4})+$/;
        const emailResult = emailRegex.test(inputEmail);
        if (!this.state.email.trim()) {
            formIsValid = false;
            errors["email"] = "Cannot be empty";
        }
        else if (!emailResult) {
            formIsValid = false;
            errors["email"] = "Email is not valid";
        }
        else {}


        // firstName
        if (!this.state.first_name.trim()) {
            formIsValid = false;
            errors["first_name"] = "Cannot be empty";
        }
        else if (typeof this.state.first_name !== "undefined") {
            if (!this.state.first_name.match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors["first_name"] = "Only letters";
            }
        }
        else {}

        // lastName
        if (!this.state.last_name.trim()) {
            formIsValid = false;
            errors["last_name"] = "Cannot be empty";
        }
        else if (!this.state.last_name.match(/^[a-zA-Z]+$/)) {
            formIsValid = false;
            errors["last_name"] = "Only letters";
        }
        else {}

        this.setState({ errors: errors });
        return formIsValid;
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value.trim() });
    }

    onSubmit = (event) => {
        let errors= {};

        event.preventDefault();
        // console.log(this.decoded);
        const userData = {
            teamName: this.decoded.teamName.trim(),
            first_name: this.state.first_name.trim(),
            last_name: this.state.last_name.trim(),
            email: this.state.email.trim(),
            password: 'init01',
            admin: false,
            firstLogin: true
        };

        const validationResult = this.handleValidation();

        if (validationResult) {
            getUsers().then(async data => {
                var destination = data.map(element => {
                    if (element.email === this.state.email) {
                        console.log('foundmatch');
                        return true;
                    }
                }).filter(item => { return item; })[0];
                // Check if email exists in db or not
                if (!destination) {
                    registerUser(userData)
                    .then(() => {
                        // To clear form input fields on successful user registration
                        this.setState({ 
                            first_name: "",
                            last_name: "",
                            email: ""
                        })
                        console.log("Form submitted");
                    })
                }
                else {
                    errors["email"] = "Email already exists";
                    this.setState({ errors: errors });
                }
            })
        }
    }

    async componentDidMount() {
        // Create a new user board only if it does not exist
        await API.getUserBoard(this.decoded._id).then(res => {
            // console.log(res);
            if (res.data === null) {
                initialData._id = this.decoded._id;
                API.createBoard(initialData).catch(err => console.log(err));
            }
        })

        if (this.decoded.firstLogin === true && this.decoded.admin === false) {
            alert("Please change your password!");
            
            updateLoginStatus(this.decoded._id);
        }
    }

    render() {
        return (
            <div className="home">
                <h1 className="team">Team <em>{this.decoded.teamName}</em></h1>
                <h1>
                    Welcome { this.decoded.first_name } { this.decoded.last_name }
                </h1>
                <ReactDND userID={ this.decoded._id } />
                {this.decoded.admin ? (
                    <div>
                        <button onClick={this.handleClick}>Timesheet</button>
                        <br></br>
                        <br></br>
                        <hr></hr>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <form onSubmit={this.onSubmit}>
                                        <h3>Add Team Members</h3>
                                        <div className='form-group'>
                                            <label htmlFor='first_name'>First Name</label>
                                            <input type='text'
                                                refs='first_name'
                                                className='form-control'
                                                name='first_name'
                                                placeholder='Enter First Name'
                                                value={this.state.first_name}
                                                onChange={this.onChange}
                                            />
                                            <span style={{ color: "red" }}>{this.state.errors["first_name"]}</span>
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='last_name'>Last Name</label>
                                            <input type='text'
                                                refs='last_name'
                                                className='form-control'
                                                name='last_name'
                                                placeholder='Enter Last Name'
                                                value={this.state.last_name}
                                                onChange={this.onChange}
                                            />
                                            <span style={{ color: "red" }}>{this.state.errors["last_name"]}</span>
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='email'>Email Address</label>
                                            <input type='email'
                                                refs='email'
                                                className='form-control'
                                                name='email'
                                                placeholder='Enter Email'
                                                value={this.state.email}
                                                onChange={this.onChange}
                                            />
                                            <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
                                        </div>
                                        <button type='submit' className='btn btn-lg btn-primary btn-block'>Add</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                ): (
                    <button onClick={this.handleClick}>Timesheet</button>
                )}
            </div>
        ) 
    }
}

export default Home;