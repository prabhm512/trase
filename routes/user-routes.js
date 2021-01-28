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
router.use(cors())
process.env.SECRET_KEY = 'secret';

module.exports = function(app) {
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
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    password: req.body.password,
                    created: today
                }
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
    app.post('/api/login', (req, res) => {
        db.Users.findOne({
            email: req.body.email
        })
        .then(response => {
            if (response) {
                if (bcrypt.compareSync(req.body.password, response.password)) {
                    const payload = {
                        _id: response._id,
                        first_name: response.first_name,
                        last_name: response.last_name,
                        email: response.email
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

    app.get('/api/profile', (req, res) => {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
        db.Users.findOne({
            _id: decoded._id
        })
        .then(response => {
            if (response) {
                res.json(response)
            }
            else {
                res.status(400).json({ error: "User does not exist" });
            }
        })
        .catch(err => {
            res.send('error: ' + err);
        })
    })

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
        console.log(req.params.email);

        db.Users.find({ email: req.params.email })
        .then(response => {
            console.log(response);
            res.json(response);   
        })
        .catch(err => {
            console.log(err);
        })
    })
}
