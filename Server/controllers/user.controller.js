const User = require('../models/user.model.js');

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
    User.findById(req.params.username)
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
// exports.create = (req, res) => {
    // // Validate request
    // if(!req.body.username || !req.body.password) {
    //     return res.status(400).send({
    //         message: "username and password can not be empty"
    //     });
    // }

    // // Create a user
    // const user = new User({
    //     title: req.body.title || "new user", 
    //     content: req.body.content
    // });

    // // Save user in the database
    // user.save()
    // .then(data => {
    //     res.send(data);
    // }).catch(err => {
    //     res.status(500).send({
    //         message: err.message || "Some error occurred while creating the user."
    //     });
    // });
// };



// Update a user identified by the username in the request
// exports.update = (req, res) => {
    // if(!req.body.content) {
    //     return res.status(400).send({
    //         message: "User content can not be empty"
    //     });
    // }

    // // Find user and update it with the request body
    // User.findByIdAndUpdate(req.params.userId, {
    //     title: req.body.title || "Untitled User",
    //     content: req.body.content
    // }, {new: true})
    // .then(user => {
    //     if(!user) {
    //         return res.status(404).send({
    //             message: "User not found with id " + req.params.userId
    //         });
    //     }
    //     res.send(user);
    // }).catch(err => {
    //     if(err.kind === 'ObjectId') {
    //         return res.status(404).send({
    //             message: "User not found with id " + req.params.userId
    //         });                
    //     }
    //     return res.status(500).send({
    //         message: "Error updating user with id " + req.params.userId
    //     });
    // });
// };

// Delete a user with the specified username in the request
// exports.delete = (req, res) => {
    // Null
// };