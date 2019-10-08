const User = require('../models/user.model.js');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
let config = require('../util/config');


let clientAddress = 'http://localhost:3000';

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Find a single user with a username
exports.findOne = (req, res) => {
    User.find({username: req.params.username})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.username
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.username
        });
    });
};

// Create and Save a new user
exports.create = (req, res) => {
    // Validate request
    if(!req.body.email || !req.body.username || !req.body.password) {
        return res.status(400).send({
            message: "email, username and password can not be empty"
        });
    }
    let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // Create a user

    const user = new User({
        username: req.body.username,
        name: req.body.name, 
        password: req.body.password,
        name: req.body.name,
        email: req.body.email,
        verifyToken: token
    });

    // Save user in the database
    user.save()
    .then(data => {
        res.send(data);
        mail(user).catch(console.error);    
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    });


    // Gen token & send email here
    async function mail(user) {


        
        var readHTMLFile = async function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'buildit.iare@gmail.com', 
                pass: 'FLF@iare1206'
            }
        });
    
        let htmlPath = path.join(__dirname, '../util/verifytemplate.html');
        readHTMLFile(htmlPath, function(err, html) {
            if(err){
                console.log(err);
            }
            var template = handlebars.compile(html);
            var replacements = {
                name: user.name,
                username: user.username.toLowerCase(),
                email: user.email,
                token: user.verifyToken
            };
            var htmlToSend = template(replacements);

            transporter.sendMail({
                from: '"BuildIT" <buildit.iare@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: 'Your Verfication Code - BuildIT', // Subject line
                text: 'Hello, ' + user.name, // plain text body
                html: htmlToSend // html body
            });
        });
    }
};



// Update a user identified by the username in the request
exports.update = (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Find user and update it with the request body
    User.findOneAndUpdate({username: req.body.username} , {$set:{
        username: req.body.username,
        password: req.body.password
    }}, {new: true}, (err, doc) => {
        if(err){
            console.log("Error Occured");
        }
        console.log(doc);
    })
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.username
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.username
        });
    });
};

// Find username and check pass
exports.checkPass = (req, res) => {
    User.find({username: req.body.username})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.body.username
            });            
        }
        if(user[0].password === req.body.password && user[0].isVerified === true){
            // Login successful
            let token = jwt.sign(
                {
                    username: user[0].username,
                    isVerified: user[0].isVerified,
                    admin: user[0].admin
                },
                config.secret,
                {expiresIn: '24h'}
            );
            // return the JWT token for the future API calls
            res.cookie('token',token);
            res.cookie('username', user[0].username.toUpperCase());
            if(user[0].admin){
                res.send({
                    success: true,
                    admin: true,
                    message: "Auth successful"
                });
            } else{
                res.send({
                    success: true, 
                    message: "Auth successful"
                });
            }
            
        } else {
            res.send({
                success: false, 
                message: "Please verify account to continue."
            })
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "[caught] User not found with id " + req.body.username
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.body.username
        });
    });
};

// Check Token and activate account
exports.checkToken = (req, res) => {
    User.findOneAndUpdate({email: req.query.email, verifyToken: req.query.token}, {$set:{
            isVerified: true
        }}, {new: true}, (err, doc) => {
            if(err){
                return res.send({
                    message: "Could not verify account " + req.query.email
                });
            }
        })
        .then(user => {
            if(!user) {
                return res.send({
                    message: "Could not verify account " + req.query.email
                });
            } else {
                res.send({
                    success: true,
                    message: "Account successfully verified, log in to continue."
                });
            }
        }).catch(err => {
            console.log("Caught", err, "ok");
            if(err){
                console.log(err);
            }
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Could not verify account " + req.params.email
                });              
            } else {
                return res.send({
                    message: "Could not verify account " + req.params.email
                });
            }
    });
};