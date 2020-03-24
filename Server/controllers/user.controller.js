const User = require('../models/user.model.js');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
let config = require('../util/config');
let domains = require('../util/email');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

let clientAddress = config.clientAddress;
let emailDomains = domains.domains;


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
            email: user.email,
            branch: user.branch
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
    console.log(req.body);
    if(!req.body.email || !req.body.username || !req.body.password || !req.body.name || !req.body.branch) {
        return res.status(400).send({
            success: false,
            message: "details can not be empty!"
        });
    }

    if(req.body.password !== req.body.password2){
        return res.status(400).send({
            success: false,
            message: "Check your password again!"
        });
    }

    if((req.body.username.length === 10 && req.body.username.slice(2, 6).toLowerCase() === '951a') || (req.body.username.length === 10 && req.body.username.slice(2, 6).toLowerCase() === '955a') || (req.body.username.length === 9 && req.body.username.slice(0,4) === 'iare')){
        atSign = req.body.email.indexOf('@') + 1;

    if(emailDomains.indexOf(req.body.email.slice(atSign, req.body.email.length)) === -1){
        return res.status(400).send({
            success: false,
            message: "We do not support this email provider, please try another email id."
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
        branch: req.body.branch,
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

        let htmlPath = path.join(__dirname, '../util/verifytemplate.html');
        readHTMLFile(htmlPath, function(err, html) {
            if(err){
                console.log(err);
            }
            // Oauth2 set up
            const oauth2Client = new OAuth2(
                config.OAuthClientID, // ClientID
                config.OAuthClientSecret, // Client Secret
                "https://developers.google.com/oauthplayground" // Redirect URL
            );

            oauth2Client.setCredentials({
                refresh_token: config.OAuthRefreshToken
            });
            const accessToken = oauth2Client.getAccessToken();

            const smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "buildit.iare@gmail.com", 
                    clientId: config.OAuthClientID,
                    clientSecret: config.OAuthClientSecret,
                    refreshToken: config.OAuthRefreshToken,
                    accessToken: accessToken
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // Generate Handlebars template
            var template = handlebars.compile(html);
            var replacements = {
                name: user.name,
                username: user.username.toLowerCase(),
                email: user.email,
                password: user.password,
                token: user.verifyToken,
                clientUrl: clientAddress
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
                if(error){
                    console.log(error);
                }
                smtpTransport.close();
           });

        });
    }
    } else {
        return res.status(400).send({
            success: false,
            message: "Please enter a valid roll number!"
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

exports.forgotPass = (req, res) => {
    User.findOne({username: req.body.username})
    .then(user =>{
        if(user.length === 0) {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.body.username
            });            
        }
        console.log("USER", user);
        res.send({success: true, message: "Check your Mail for Password"});
        mailUser(user).catch(console.error);  
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "User not found with id " + req.params.username
            });                
        }
    });
        // Gen token & send email here
        async function mailUser(user) {

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
    
            let htmlPath = path.join(__dirname, '../util/forgotPass.html');
            readHTMLFile(htmlPath, function(err, html) {
                if(err){
                    console.log(err);
                }
                // Oauth2 set up
                const oauth2Client = new OAuth2(
                    config.OAuthClientID, // ClientID
                    config.OAuthClientSecret, // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );
    
                oauth2Client.setCredentials({
                    refresh_token: config.OAuthRefreshToken
                });
                const accessToken = oauth2Client.getAccessToken();
    
                const smtpTransport = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: "buildit.iare@gmail.com", 
                        clientId: config.OAuthClientID,
                        clientSecret: config.OAuthClientSecret,
                        refreshToken: config.OAuthRefreshToken,
                        accessToken: accessToken
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
    
                // Generate Handlebars template
                var template = handlebars.compile(html);
                console.log("USER", user);
                var replacements = {
                    name: user.name,
                    username: user.username.toUpperCase(),
                    email: user.email,
                    password: user.password,
                    clientUrl: clientAddress
                };
                var htmlToSend = template(replacements);
    
                const mailOptions = {
                    from: "buildit.iare@gmail.com",
                    to: user.email,
                    subject: "Your Password - BuildIT",
                    generateTextFromHTML: true,
                    html: htmlToSend
                };
                console.log(replacements, mailOptions);
                smtpTransport.sendMail(mailOptions, (error, response) => {
                    if(error){
                        console.log(error);
                    }
                    smtpTransport.close();
               });
    
            });
        }
}

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
                    message: "Auth successful",
                    branch: user[0].branch.toLowerCase()
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

// Delete a user with username
exports.delete = (req, res) => {
    User.findOneAndRemove({username: req.params.username})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "user not found with id " + req.params.username
            });
        }
        res.send({message: "user deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                success: false,
                message: "user not found with id " + req.params.username
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Could not delete user with id " + req.params.username
        });
    });
};