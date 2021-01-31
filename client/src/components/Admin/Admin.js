import React, { Component } from 'react';
import { registerTeam, getTeams } from '../../utils/apis/userFunctions';

class Admin extends Component {
    constructor() {
        super()
        this.state = {
            teamName: '',
            email: '',
            password: ''
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleValidation() {
        let errors = {};
        let formIsValid = true;

        // team name
        if (!this.state.teamName) {
            formIsValid = false;
            errors["teamName"] = "Cannot be empty";
        }
        else if (typeof this.state.teamName !== "undefined") {
            if (!this.state.teamName.match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors["teamName"] = "Only letters";
            }
        }

        // email
        const inputEmail = this.state.email;
        const emailRegex = /^\w+([\.-]?\w+)*@[a-z]+([\.-]?[a-z]+)*(\.[a-z]{2,4})+$/;
        const emailResult = emailRegex.test(inputEmail);
        if (!this.state.email) {
            formIsValid = false;
            errors["email"] = "Cannot be empty";
        }
        else if (!emailResult) {
            formIsValid = false;
            errors["email"] = "Email is not valid";
        }
        else {}

        // password
        if (!this.state.password) {
            formIsValid = false;
            errors["password"] = "Cannot be empty";
        }
        else if (this.state.password.length < 6) {
            formIsValid = false;
            errors["password"] = "Password must be at least 6 characters";
        }
        else {}

        this.setState({ errors: errors });
        return formIsValid;

    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        let errors = {};
        e.preventDefault();
        const userData = {
            teamName: this.state.teamName,
            email: this.state.email,
            password: this.state.password
        };
        // console.log(userData);

        const result = this.handleValidation();
        if (result) {
            getTeams().then(data => {
                console.log(data);

                var destination = data.map(element => {
                    if (element.email === this.state.email) {
                        console.log('foundmatch');
                        return true;
                    }
                }).filter(item => { return item; })[0];
                // Check if email exists in db or not
                if (!destination) {
                    registerTeam(userData).then(res => {
                        setTimeout(() => this.props.history.push('/login'), 200);
                    })
                    console.log("Form submitted");
                }
                else {
                    errors["email"] = "Email already exists";
                    this.setState({ errors: errors });
                }
            })
        }
        else {
            console.log("Form has errors.")
        }
    }
    render() {
        return (
            <div className="admin">
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6 mt-5 mx-auto'>
                            <form noValidate onSubmit={ this.onSubmit }>
                                <h1 className='h3 mb-3 font-weight normal'>Register Team</h1>
                                <div className='form-group'>
                                    <label htmlFor='text'>Team Name</label>
                                    <input type='text'
                                    className='form-control'
                                    name='teamName'
                                    placeholder='Enter Team Name'
                                    value={ this.state.teamName }
                                    onChange={ this.onChange }
                                    />
                                </div>
                                <h1 className='h4 mb-3 font-weight normal'>Team Lead Details</h1>
                                <div className='form-group'>
                                    <label htmlFor='email'>Email</label>
                                    <input type='email'
                                    className='form-control'
                                    name='email'
                                    placeholder='Enter Email'
                                    value={ this.state.email }
                                    onChange={ this.onChange }
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='password'>Password</label>
                                    <input type='password'
                                    className='form-control'
                                    name='password'
                                    placeholder='Enter Password'
                                    value={ this.state.password }
                                    onChange={ this.onChange }
                                    />
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

export default Admin;