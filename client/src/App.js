import React , { useState, useEffect } from 'react';
import './App.css';
import Tasks from './components/Tasks/Tasks';
import Timesheet from './components/Timesheet/Timesheet';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';

import Navbar from "./components/Navbar/Navbar";
import Landing from "./components/Landing/Landing";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Admin from './components/Admin/Admin';
import Team from './components/Team/Team';
import Auth from './Auth';

import { getOneUser, updatePassword } from './utils/apis/userFunctions';
import jwt_decode from 'jwt-decode';
import { Modal, Button } from 'react-bootstrap';
import { decode } from 'jsonwebtoken';

function App() {

    const history = useHistory();

    // Managing state of modal that allows password to be reset
    const [show, setShow] = useState(false);

    // Managing state of modal that alerts user on successful password change
    const [alertShow, setAlertShow] = useState(false);

    // Manage state of errors
    const [error, setError] = useState({
        errors: {}
    })
    let token, decoded;
    if (localStorage.usertoken) {
        token = localStorage.usertoken;
        decoded = jwt_decode(token);
    }

    const handleClose = event => { 
        
        getOneUser(decoded).then(response => {
            const newPwd = document.querySelector('.new-password').value.trim();
            const confirmNewPwd = document.querySelector('.confirm-new-password').value.trim();

            // Used for validation
            let errors = {};
            let formIsValid = true;

            const updatePasswordData = {
                _id: decoded._id,
                newPwd: newPwd
            };
            // password
            if (newPwd.length < 6) {
                formIsValid = false;
                errors["newPwd"] = "Password must be at least 6 characters";
            }

            else if (confirmNewPwd !== newPwd) {
                formIsValid = false;
                errors["confirmNewPwd"] = "Password does not match the one above"
            }

            else {}

            setError({
                errors: errors
            });

            if (formIsValid) {
                // console.log(updatePasswordData);
                updatePassword(updatePasswordData);
                setShow(false);
                
                //Log user out
                localStorage.removeItem('usertoken');
                history.push('/login');
                setAlertShow(true);
            }
        })
    };

    const handleShow = () => {
        setShow(true)
    }; 

    useEffect(() => {
        document.getElementById('overlay').style.display = 'none';
    }, []);

    return (
        <div className="App">
            <Switch>
                <div className="container-fluid pl-0 pr-0 m-0">
                    <Navbar handleShowCB={handleShow}/>
                    <Route exact path="/" component={Landing} />
                    <div className='container-fluid m-0 p-0'>
                        <Route exact path="/demo/tasks" render={(props) => <Tasks {...props} handleShowCB={handleShow} />} />
                        <Route exact path="/demo/timesheet" component={Timesheet} />
                        <Route exact path="/demo/engagements" component={Team} />
                        <Route exact path="/tasks" render={(props) => localStorage.getItem('usertoken') ? <Tasks {...props} handleShowCB={handleShow} /> : <Landing {...props} />}/>
                        <Route exact path="/timesheet/:id" component={Auth(Timesheet)}/>
                        <Route exact path="/admin" render={(props) => localStorage.getItem('usertoken') ? decoded.admin ? <Admin {...props} /> : <Redirect {...props} to="/tasks" />  : <Redirect {...props} to="/" /> } />
                        <Route exact path="/engagements" component={Auth(Team)} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                    </div>
                    {/* {localStorage.getItem('usertoken') ? <Redirect to="/tasks" /> : <Redirect to="/" />}  */}
                </div>
            </Switch>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{color: '#1874cd'}}>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label htmlFor='new-password'>New Password</label>
                        <br></br>
                        <input type="password" className="new-password"></input>
                        <span style={{ color: "red" }}>{error.errors["newPwd"]}</span>
                        <br></br>
                        <br></br>
                        <label htmlFor='confirm-new-password'>Confirm Password</label>
                        <br></br>
                        <input type="password" className="confirm-new-password"></input>
                        <span style={{ color: "red" }}>{error.errors["confirmNewPwd"]}</span>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" style={{bgcolor: '#1874cd', color: 'white'}} onClick={handleClose}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={alertShow}
                onHide={() => setAlertShow(false)}
                keyboard={false}>
                <Modal.Header className="pwdChangeAlert" closeButton><b>Password changed successfully!</b></Modal.Header>
            </Modal>
        </div>
    )
}

export default App;