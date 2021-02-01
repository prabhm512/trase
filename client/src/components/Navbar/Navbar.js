import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
// import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import { Modal } from 'react-bootstrap';

import { Link, withRouter } from "react-router-dom";
import { getOneUser, updatePassword } from '../../utils/apis/userFunctions';
import jwt_decode from 'jwt-decode';

import './style.css';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

function TemporaryDrawer(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        right: false
    });

    // Managing state of modal that allows password to be reset
    const [show, setShow] = useState(false);

    // Manage state of errors
    const [error, setError] = useState({
        errors: {}
    })

    const handleClose = event => { 
        

        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);

        getOneUser(decoded).then(response => {
            const newPwd = document.querySelector('.newPassword').value.trim();
            const confirmNewPwd = document.querySelector('.confirmNewPassword').value.trim();

            // Used for validation
            let errors = {};
            let formIsValid = true;

            // console.log(event.target.parentElement.parentElement);
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
                updatePassword(updatePasswordData);
                setShow(false);
            }
        })
    };

    const handleShow = () => setShow(true);

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        
        setState({ ...state, [anchor]: open });
    };

    //Log user out
    const logOut = e => {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        props.history.push('/');
    }
    
    const userList = anchor => (
        <div
        className={clsx(classes.list, {
            [classes.fullList]: anchor === 'top' || anchor === 'bottom',
        })}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
        >
            {localStorage.usertoken ? (
                // <List>
                //     {['Home', 'Tasks', 'Logout'].map((text, index) => (
                //         <Link key={text} to={text}>
                //             <ListItem button key={text}>                    
                //                     {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
                //                     <ListItemText primary={text} />
                //             </ListItem>
                //         </Link>
                //     ))}
                // </List>
                <List>
                    <Link to={'/'}>
                        <ListItem button>
                            <ListItemText primary='Home' />
                        </ListItem>
                    </Link>
                    <Link to={'/tasks'}>
                        <ListItem button>
                            <ListItemText primary='Tasks' />
                        </ListItem>
                    </Link>
                    <ListItem button onClick={handleShow}>
                        <ListItemText primary='Reset Pwd' />
                    </ListItem>
                    <ListItem button onClick={logOut.bind(this)}>
                        <ListItemText primary='Logout' />
                    </ListItem>
                </List>

            ): 
            (
                <List>
                    <Link to={'/'}>
                        <ListItem button>
                            <ListItemText primary='Home' />
                        </ListItem>
                    </Link>
                    <Link to={'/login'}>
                        <ListItem button>
                            <ListItemText primary='Login' />
                        </ListItem>
                    </Link>
                    <Link to={'/register'}>
                        <ListItem button>
                            <ListItemText primary='Register' />
                        </ListItem>
                    </Link>
                </List>
            )}
            {/* <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List> */}
        </div>
    );  
                
    return (
        <div>
            <nav className='navbar navbar-expand-lg'>
                <div className='collapse navbar-collapse d-flex justify-content-end' id='navbar1'>
                {[`right`].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <Button onClick={toggleDrawer(anchor, true)}><MenuIcon /></Button>
                        <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                            {userList(anchor)}
                        </Drawer>
                    </React.Fragment>
                ))}
                </div>
            </nav>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor='newPassword'>New Password</label>
                    <br></br>
                    <input type="password" className="newPassword"></input>
                    <span style={{ color: "red" }}>{error.errors["newPwd"]}</span>
                    <br></br>
                    <br></br>
                    <label htmlFor='confirmNewPassword'>Confirm Password</label>
                    <br></br>
                    <input type="password" className="confirmNewPassword"></input>
                    <span style={{ color: "red" }}>{error.errors["confirmNewPwd"]}</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
                    
export default withRouter(TemporaryDrawer);