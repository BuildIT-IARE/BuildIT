const Participation = require('../models/participation.model.js');
const contests = require('./contest.controller.js');

var moment = require('moment');
// Create and Save a new participation
exports.create = (req, res) => {
    req.body.username = req.decoded.username;
    // Validate request
    if(!req.body.username) {
        return res.status(400).send({
            success: false,
            message: "user Id can not be empty"
        });
    }

    if(!req.body.contestId) {
        return res.status(400).send({
            success: false,
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
                // Save participation in the database
                participation.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        success: false,
                        message: err.message || "Some error occurred while Registering."
                    });
                });
            });
        } else {
            res.send({success: false, message: "user already participated"});

        }
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving participation."
        });
    });

    
};

// add sol to participation
exports.acceptSubmission = (sub, callback) => {
    // Change here
    // Find participation and update it with the request body
    Participation.find({participationId: sub.participationId})
    .then(participation => {
        // Check prev sub
            console.log("Found participation");
            console.log(participation);
            participation = participation[0];
            updated = false
            if (participation.submissionResults.length !== 0){
            for (let i = 0; i < participation.submissionResults.length; i++){
                if (participation.submissionResults[i].questionId === sub.questionId){
                    if (participation.submissionResults[i].score < sub.score){
                        // Update higher score
                        updated = true;
                        Participation.findOneAndUpdate({participationId: sub.participationId}, {$set:{
                            submissionResults: { questionId: sub.questionId, score: sub.score}
                          }}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data!");
                            }
                            // console.log(doc);
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
                    }
                }
            }
        }
            if (!updated){
                Participation.findOneAndUpdate({participationId: sub.participationId}, {$set:{
                    submissionResults: { questionId: sub.questionId, score: sub.score}
                  }}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                    // console.log(doc);
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
            }
            }).catch(err => {
                console.log(err);
                res.status(500).send({
                    success: false,
                    message: err.message || "Some error occurred while retrieving participation."
                });
            });    
};

// Retrieve and return all participations from the database.
exports.findAll = (req, res) => {
    Participation.find()
    .then(participation => {
        res.send(participation);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving participation."
        });
    });
};

// Retrieve and return all participation details for user in contest.
exports.findUser = (req, res) => {
    Participation.find({participationId: req.decoded.username + req.params.contestId})
    .then(participation => {
        res.send(participation);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving participation."
        });
    });
};

// Retrieve and return all participation details.
exports.findContestPart = (req, res) => {
    Participation.find({contestId: req.body.contestId})
    .then(participation => {
        res.send(participation);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving participation."
        });
    });
};

exports.findUserTime = (result, callback) => {
    Participation.find({participationId: result.participationId})
    .then(participation => {
        if(!participation){
            return callback("Couldn't find participation", null);
        }
        return callback(null, participation);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return callback("Couldn't find participation, caught exception", null);                 
        }
        return callback("Error retrieving data", null);
    });
};