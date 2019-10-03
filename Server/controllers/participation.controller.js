const Participation = require('../models/participation.model.js');
const contests = require('./contest.controller.js');

var moment = require('moment');
// Create and Save a new participation
exports.create = (req, res) => {
    req.body.username = req.decoded.username;
    // Validate request
    if(!req.body.username) {
        return res.status(400).send({
            message: "user Id can not be empty"
        });
    }

    if(!req.body.contestId) {
        return res.status(400).send({
            message: "contest Id can not be empty"
        });
    }
    
    Participation.find({participationId: req.body.username + req.body.contestId})
    .then(participation => {
        if (participation.length === 0){
            contests.getDuration(req, (err, duration) => {
                if (err){
                    res.send({success: false, message: "Error occured"});
                }
        
                let date = moment();
                let d = duration.duration;
                let endTime = moment(date, 'HH:mm:ss').add(d, 'minutes');
        
                // Create a Participation
                const participation = new Participation({
                    participationId: req.body.username + req.body.contestId,
                    username: req.body.username,
                    contestId: req.body.contestId,
                    participationTime: date,
                    submissionResults: [],
                    validTill: endTime
                });
                // Save Registration in the database
                participation.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while Registering."
                    });
                });
            });
        } else {
            res.send({success: false, message: "user already participated"});

        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving participation."
        });
    });

    
};

// add sol to participation
exports.acceptSubmission = (sub, callback) => {
    if(!req.body.participationId) {
        return callback("id can not be empty", null);
    }

    // Find participation and update it with the request body
    Participation.findOneAndUpdate({participationId: req.body.participationId}, {$push:{
        submissionResults: { questionId: sub.questionId, score: sub.score}
      }}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
      })
    .then(participation => {
        if(!participation) {
            return callback("Participation not found with Id ", null);
        }
        return callback(null, participation);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return callback("Participation not found with Id ", null);    
        }
        return callback("Error updating Participation with Id ", null);
    });
};

// Retrieve and return all participations from the database.
exports.findAll = (req, res) => {
    Participation.find()
    .then(participation => {
        res.send(participation);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving participation."
        });
    });
};

// Retrieve and return all participation details.
exports.findUser = (req, res) => {
    Participation.find({participationId: req.decoded.username + req.params.contestId})
    .then(participation => {
        res.send(participation);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving participation."
        });
    });
};