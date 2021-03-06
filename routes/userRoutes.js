const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load User model
const db = require("../models");
const { de } = require("date-fns/locale");
router.use(cors())
process.env.SECRET_KEY = 'secret';

module.exports = function(app) {

    // --------Users--------------
    app.get('/api/users', (req, res) => {
        db.Users.find()
        .then(response => {
            if (response) {
                res.json(response)
            }
            else {
                res.status(400).json({ error: "Users do not exist" });
            }
        })
        .catch(err => {
            res.send('error: ' + err);
        })
    })

    app.get('/api/users/:email', (req, res) => {

        db.Users.find({ email: req.params.email })
        .then(response => {
            res.json(response);   
        })
        .catch(err => {
            console.log(err);
        })
    })

    app.post('/api/register', (req, res) => {
        // Form validation
        const { errors, isValid } = validateRegisterInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        db.Users.findOne({
            email: req.body.email
        })
        .then( response => {
            if (response) {
                res.status(400).json({ email: "Email already exists" });
                return res.send("Email already exists");
            }
            else {
                const today = new Date()
                const userData = {
                    teamName: req.body.teamName,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    password: req.body.password,
                    empCost: req.body.empCost,
                    admin: req.body.admin,
                    firstLogin: req.body.firstLogin,
                    created: today
                }
                // console.log(userData);
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) throw err;
                    userData.password = hash
                    db.Users.create(userData)
                    .then(user => {
                        res.json(user);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
            }
        })
    })

    app.put('/api/status/:id', (req, res) => {
        // Update password of logged in user
        db.Users
            .findOneAndUpdate({ _id: req.params.id }, { firstLogin: false }, ((err, result) => {
                if (err) {
                    console.log(err);
                } 
            })
        )
    })


    app.post('/api/login', (req, res) => {
        db.Users.findOne({
            email: req.body.email
        })
        .then(response => {
            if (response) {
                if (bcrypt.compareSync(req.body.password, response.password)) {
                    const payload = {
                        _id: response._id,
                        teamName: response.teamName,
                        first_name: response.first_name,
                        last_name: response.last_name,
                        email: response.email,
                        empCost: response.empCost,
                        admin: response.admin,
                        firstLogin: response.firstLogin
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        // 1 year in seconds
                        expiresIn: 31556926 
                    })
                    res.send(token)
                }
                else {
                    res.status(400).json({ error: "User does not exist" });
                }
            }
            else {
                res.status(400).json({ error: "User does not exist" });
            }
        })
        .catch(err => {
            res.send('error: ' + err);
        })
    })

    app.delete('/api/users/:email', (req, res) => {

        db.Users.findOneAndDelete({ email: req.params.email }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Deleted: ' + req.params.email);
            }
        })
    })

    app.put('/api/password/:id', (req, res) => {

        bcrypt.hash(req.body.updatePasswordData.newPwd, 10, (err, hash) => {
            if (err) throw err;
            // Update password of logged in user
            db.Users
                .findOneAndUpdate({ _id: req.params.id }, { password: hash }, ((err, result) => {
                    if (err) {
                        console.log(err);
                    }
                })
            )
        })
    })


    // ---------Teams-------------

    app.get('/api/teams', (req, res) => {
        db.Teams.find()
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.send('error: ' + err);
        })
    })    

    app.get('/api/teams/:teamName', (req, res) => {
        db.Teams.findOne({ teamName: req.params.teamName })
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.send('error: ' + err);
        })
    })
    
    app.post('/api/teams', (req, res) => {

        db.Teams.findOne({
            teamName: req.body.teamName
        })
        .then( response => {
            if (response) {
                res.status(400).json({ teamName: "Team name already exists" });
                return res.send("Team name already exists");
            }
            else {
                const today = new Date()
                const teamData = {
                    teamName: req.body.teamName,
                    adminEmail: req.body.adminEmail,
                    engagements: req.body.engagements,
                    created: today
                }

                db.Teams.create(teamData)
                    .then(team => {
                        res.json(team);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
    })

    app.put('/api/teams/:teamName', (req, res) => {

        db.Teams.findOneAndUpdate({ teamName: req.params.teamName }, { $push: { engagements: req.body.engName }}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        })
    })

    app.get('/api/members/:teamName', (req, res) => {
        db.Users.find({ teamName: req.params.teamName })
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            res.send('error: ' + err);
        })
    })
}
