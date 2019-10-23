const User = require('../models/user.model.js');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
let config = require('../util/config');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

let clientAddress = 'http://localhost:3000';

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            success: false,
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
                success: false,
                message: "User not found with id " + req.params.username
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving user with id " + req.params.username
        });
    });
};

// Find a single user with a username
exports.findOnePublic = (req, res) => {
    User.find({username: req.params.username})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.params.username
            });            
        }
        user = user[0];
        let sendUser = {
            username: user.username,
            name: user.name, 
            email: user.email
        }
        res.send(sendUser);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving user with id " + req.params.username
        });
    });
};

// Create and Save a new user
exports.create = (req, res) => {
    // Validate request
    if(!req.body.email || !req.body.username || !req.body.password) {
        return res.status(400).send({
            success: false,
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
        data.success = true;
        res.send(data);
        mail(user).catch(console.error);    
    }).catch(err => {
        err.success = false;
        err.message1 = err.message;
        err.message = "";
        if (err.message1.includes('username')){
            err.message = err.message + 'Username is already taken. \n';
        }
        if (err.message1.includes('email')){
            err.message = err.message + 'Email is already taken. \n';
        }
        res.status(500).send(err);
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
  
        // let transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     host: 'smtp.gmail.com',
        //     auth: {
        //         user: 'buildit.iare@gmail.com', 
        //         pass: 'FLF@iare1206'
        //     }
        // });
    
        let htmlPath = path.join(__dirname, '../util/verifytemplate.html');
        readHTMLFile(htmlPath, function(err, html) {
            if(err){
                console.log(err);
            }
            // Oauth2 set up
            const oauth2Client = new OAuth2(
                "1064096911787-mkih3p6r7f6p2tcc24i267736mu8qljj.apps.googleusercontent.com", // ClientID
                "Qs2c7YP8Q8jCMw-PIbARUrmn", // Client Secret
                "https://developers.google.com/oauthplayground" // Redirect URL
            );

            oauth2Client.setCredentials({
                refresh_token: "1//04XEQXx_iEG72CgYIARAAGAQSNwF-L9Ir9XRvFe7XM6QPG8DM5Rgnd14TQHMf2fbgTGiLZk5ak6QfSFcp98jgdjACTtWR4oMAH_A"
            });
            const accessToken = oauth2Client.getAccessToken();

            const smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "buildit.iare@gmail.com", 
                    clientId: "1064096911787-mkih3p6r7f6p2tcc24i267736mu8qljj.apps.googleusercontent.com",
                    clientSecret: "Qs2c7YP8Q8jCMw-PIbARUrmn",
                    refreshToken: "1//04XEQXx_iEG72CgYIARAAGAQSNwF-L9Ir9XRvFe7XM6QPG8DM5Rgnd14TQHMf2fbgTGiLZk5ak6QfSFcp98jgdjACTtWR4oMAH_A",
                    accessToken: accessToken
                }
            });

            // Generate Handlebars template
            var template = handlebars.compile(html);
            var replacements = {
                name: user.name,
                username: user.username.toLowerCase(),
                email: user.email,
                token: user.verifyToken
            };
            var htmlToSend = template(replacements);

            const mailOptions = {
                from: "buildit.iare@gmail.com",
                to: user.email,
                subject: "Your Verfication Code - BuildIT",
                generateTextFromHTML: true,
                html: htmlToSend
            };
            
            smtpTransport.sendMail(mailOptions, (error, response) => {
                error ? console.log(error) : console.log(response);
                smtpTransport.close();
           });

            // transporter.sendMail({
            //     from: '"BuildIT" <buildit.iare@gmail.com>', // sender address
            //     to: user.email, // list of receivers
            //     subject: 'Your Verfication Code - BuildIT', // Subject line
            //     text: 'Hello, ' + user.name, // plain text body
            //     html: htmlToSend // html body
            // });
        });
    }
};



// Update a user identified by the username in the request
exports.update = (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.status(400).send({
            success: false,
            message: "User content can not be empty"
        });
    }

    // Find user and update it with the request body
    User.findOneAndUpdate({username: req.body.username} , {$set:{
        username: req.body.username,
        password: req.body.password
    }}, {new: true}, (err, doc) => {
        if(err){
            console.log(err);
        }
    })
    .then(user => {
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.params.username
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error updating user with id " + req.params.username
        });
    });
};

// Find username and check pass
exports.checkPass = (req, res) => {
    User.find({username: req.body.username})
    .then(user => {
        if(user.length === 0) {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.body.username
            });            
        }
        if(user[0].password === req.body.password){
            if(user[0].isVerified === true){
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
            res.cookie('token', token);
            res.cookie('username', user[0].username.toUpperCase());

            // return the JWT token for the future API calls
            if(user[0].admin){
                res.send({
                    success: true,
                    admin: true,
                    token: token,
                    username: user[0].username.toUpperCase(),
                    message: "Auth successful"
                });
            } else{
                res.send({
                    success: true,
                    token: token,
                    username: user[0].username.toUpperCase(), 
                    message: "Auth successful"
                });
            }
        } else {
            res.send({
                success: false, 
                message: "Please verify account to continue."
            });
        }
            
        } else {
            res.send({
                success: false, 
                message: "Incorrect password entered."
            })
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "[caught] User not found with id " + req.body.username
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving user with id " + req.body.username
        });
    });
};

// Check Token and activate account
exports.checkToken = (req, res) => {
    User.findOneAndUpdate({email: req.body.email, verifyToken: req.body.token}, {$set:{
            isVerified: true
        }}, {new: true}, (err, doc) => {
            if(err){
                return res.send({
                success: false,
                    message: "Could not verify account " + req.body.email
                });
            }
        })
        .then(user => {
            if(!user) {
                return res.send({
                success: false,
                    message: "Could not verify account " + req.body.email
                });
            } else {
                res.send({
                    success: true,
                    message: "Account successfully verified, log in to continue."
                });
            }
        }).catch(err => {
            if(err){
                console.log(err);
            }
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                success: false,
                    message: "Could not verify account " + req.body.email
                });              
            } else {
                return res.send({
                success: false,
                    message: "Could not verify account " + req.body.email
                });
            }
    });
};