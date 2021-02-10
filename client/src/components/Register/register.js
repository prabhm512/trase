/* eslint-disable array-callback-return */
/* eslint-disable no-useless-escape */
import React, { Component } from "react";
import { registerUser, getUsers, getTeams, registerTeam, getOneUser } from '../../utils/apis/userFunctions';
import API from '../../utils/apis/API';
import initialData from '../ReactDND/initial-data';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teamName: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            empCost: 0,
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleValidation() {
        let errors = {};
        let formIsValid = true;
        // team name
        if (!this.state.teamName.trim()) {
            formIsValid = false; 
            errors["teamName"] = "Cannot be empty";
        }

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

        // password
        if (!this.state.password.trim()) {
            formIsValid = false;
            errors["password"] = "Cannot be empty";
        }
        else if (this.state.password.length < 6) {
            formIsValid = false;
            errors["password"] = "Password must be at least 6 characters";
        }
        else {}

        // firstName
        if (!this.state.first_name.trim()) {
            formIsValid = false;
            errors["first_name"] = "Cannot be empty";
        }
        else if (typeof this.state.first_name !== "undefined") {
            if (!this.state.first_name.trim().match(/^[a-zA-Z]+$/)) {
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

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        let errors = {};
        event.preventDefault();
        const userData = {
            teamName: this.state.teamName.trim(),
            first_name: this.state.first_name.trim(),
            last_name: this.state.last_name.trim(),
            email: this.state.email.trim(),
            password: this.state.password.trim(),
            empCost: this.state.empCost,
            admin: true
        };

        const teamData = {
            teamName: this.state.teamName.trim(),
            adminEmail: this.state.email.trim(),
            engagements: []
        };

        var validationResult = this.handleValidation();

        if (validationResult) {
            getTeams().then(async data => {
                var destination = data.map(element => {
                    if (element.teamName.toLowerCase() === this.state.teamName.toLowerCase()) {
                        return true;
                    }
                }).filter(item => { return item; })[0];
    
                if (destination) {
                    errors["teamName"] = "This name is already being used! Please try another name.";
                    this.setState({ errors: errors });
                }
                else {
                    await getUsers().then(async data => {
                        var destination = data.map(element => {
                            if (element.email === this.state.email) {
                                console.log('foundmatch');
                                return true;
                            }
                        }).filter(item => { return item; })[0];
                        // Check if email exists in db or not
                        if (!destination) {
                            await registerTeam(teamData);
                            registerUser(userData).then(() => {
                                getOneUser(userData).then(async res => {
                                    initialData._id = res[0]._id;
                                    initialData.teamName = res[0].teamName;
                                    initialData.empCost = res[0].empCost;
                                    await API.createBoard(initialData).catch(err => console.log(err));
                                })
                            })
                            .then(() => {
                                this.props.history.push('/login');
                            })
                            console.log("Form submitted");
                        }
                        else {
                            errors["email"] = "Email already exists";
                            this.setState({ errors: errors });
                        }
                    })                    
                }
            })
        }
        else {
            console.log("Form has errors.")
        }
    }

    render() {
        return (
            <div className="register">
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6 mt-5 mx-auto'>
                            <form noValidate onSubmit={this.onSubmit}>
                                <h1 className='h3 mb-3 font-weight normal'>Sign Up</h1>
                                <div className='form-group'>
                                    <label htmlFor='teamName'>Team Name</label>
                                    <input type='text'
                                        className='form-control'
                                        name='teamName'
                                        placeholder='Enter Team Name'
                                        value={this.state.teamName}
                                        onChange={this.onChange}
                                    />
                                    <span style={{ color: "red" }}>{this.state.errors["teamName"]}</span>
                                </div>
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
                                <div className='form-group'>
                                    <label htmlFor='empCost'>Cost per hour</label>
                                    <input type='number'
                                        refs='empCost'
                                        className='form-control'
                                        name='empCost'
                                        placeholder='Enter Employee Cost (per hour)'
                                        value={this.state.empCost}
                                        onChange={this.onChange}
                                    />
                                    <span style={{ color: "red" }}>{this.state.errors["empCost"]}</span>
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='password'>Password</label>
                                    <input type='password'
                                        refs='password'
                                        className='form-control'
                                        name='password'
                                        placeholder='Enter Password'
                                        value={this.state.password}
                                        onChange={this.onChange}
                                    />
                                    <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                                </div>
                                <button type='submit' className='btn btn-lg btn-primary btn-block'>
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;
