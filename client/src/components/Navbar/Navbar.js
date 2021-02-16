import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Divider, Drawer, Button, List, ListItem, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import jwt_decode from 'jwt-decode';
import { Link, withRouter, useHistory } from "react-router-dom";

import './Navbar.css';
import { Typography } from '@material-ui/core';

const font = "'Lobster', cursive";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

const prodNameTheme = createMuiTheme({
    typography: {
        fontFamily: font,
        color: '#2094B9',
        paddingLeft: 10
    }
})

function TemporaryDrawer(props) {

    const classes = useStyles();
    const [state, setState] = useState({
        right: false
    });
    
    const history = useHistory();
    let token;
    let decoded = null;
    
    if (localStorage.usertoken) {
        token = localStorage.usertoken;
        decoded = jwt_decode(token);
    }

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
                <List>
                    <Link to={'/tasks'}>
                        <ListItem button>
                            <ListItemText primary='Tasks' />
                        </ListItem>
                    </Link>
                    <Link to={'/timesheet/' + decoded._id}>
                        <ListItem button>
                            <ListItemText primary='Timesheet' />
                        </ListItem>
                    </Link>
                    {decoded.admin ? (
                        <div>
                            <Link to={'/engagements'}>
                                <ListItem>
                                    <ListItemText primary='Engagements' />
                                </ListItem>
                            </Link>
                            <Divider />
                            <Link to={'/admin'}>
                                <ListItem>
                                    <ListItemText primary='Admin' />
                                </ListItem>
                            </Link>
                        </div>
                    ) : (
                        <Link to={'/engagements'}>
                            <ListItem>
                                <ListItemText primary='Engagements' />
                            </ListItem>
                        </Link>
                    )}
                    <Divider />
                    <ListItem button onClick={props.handleShowCB}>
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
        </div>
    );  

    const handleProdNameBtnClick = () => {
        if (decoded === null) {
            history.push('/')
        } else {
            history.push('/tasks');
        }
    }
    
    return (
        <nav className='navbar navbar-expand-lg'>
            {/* <div className='collapse navbar-collapse d-flex justify-content-end' id='navbar1'> */}
            <div className="container-fluid">
                <Typography style={prodNameTheme.typography}>
                    <button className="productNameButton" onClick={handleProdNameBtnClick}><h1 className="productName">Trase</h1></button> 
                </Typography>
                {[`right`].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <Button onClick={toggleDrawer(anchor, true)}><MenuIcon /></Button>
                        <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                            {userList(anchor)}
                        </Drawer>
                    </React.Fragment>
                ))}
            </div>
            {/* </div> */}
        </nav>
    );
}
                    
export default withRouter(TemporaryDrawer);