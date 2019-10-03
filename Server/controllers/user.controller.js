const User = require('../models/user.model.js');

let jwt = require('jsonwebtoken');
let config = require('../util/config');

let clientAddress = 'http://localhost:3000/';

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
    if(!req.body.username || !req.body.password) {
        return res.status(400).send({
            message: "username and password can not be empty"
        });
    }

    // Create a user
    const user = new User({
        username: req.body.username, 
        password: req.body.password,
        name: req.body.name,
        admin: req.body.admin
    });

    // Save user in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    });
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
        if(user[0].password === req.body.password){
            // Login successful
            // console.log(user[0]);
            let token = jwt.sign(
                {
                    username: user[0].username,
                    admin: user[0].admin
                },
                config.secret,
                {expiresIn: '24h'}
            );
            // return the JWT token for the future API calls
            res.cookie('token',token);
            res.redirect(clientAddress);
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.body.username
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.body.username
        });
    });
};
