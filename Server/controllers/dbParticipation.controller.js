const DBParticipation = require('../models/dbParticipation.model.js');
const DBSession = require("./dbSession.controller.js");
var moment = require("moment");

// Create and Save a new participation
exports.create = (req, res) => {
    req.body.username = req.decoded.username;
    // Validate request
    if (!req.body.username) {
        return res.status(400).send({
            success: false,
            message: "user Id can not be empty",
        });
    }
    if (!req.body.branch && req.body.username !== "admin") {
        return res.status(400).send({
        success: false,
        message: "user Branch can not be empty",
        });
    }
    if (!req.body.dbSessionId) {
        return res.status(400).send({
            success: false,
            message: "dbSessionId can not be empty",
        });
    }
    DBParticipation.find({
        participationId: req.body.username + req.body.dbSessionId,
    })
    .then((participation) => {
        if (participation.length === 0) {
            DBSession.getDuration(req, (err, duration) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: "Error occurred"
                    });
                }
                let date = moment();
                let d = duration.duration;
                let endTime = moment(date, "HH:mm:ss").add(d, "minutes");
                // Create a Participation
                const participation = new DBParticipation({
                    participationId: req.body.username + req.body.dbSessionId,
                    username: req.body.username,
                    branch: req.body.branch,
                    dbSessionId: req.body.dbSessionId,
                    participationTime: date,
                    submissionResults: [],
                    validTill: endTime,
                });
                // Save participation in the database
                participation
                .save()
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    res.status(500).send({
                        success: false,
                        message:
                            err.message || "Some error occurred while Registering(DB).",
                    });
                });
            });
        } else {
            res.send({ success: false, message: "User already participated(DB)" });
        }
    })
    .catch((err) => {
        res.status(500).send({
            success: false,
            message:
            err.message || "Some error occurred while retrieving dbParticipation.",
        });
    });
};

exports.acceptSubmission = (sub,callback) => {
    DBParticipation.find({ participationId: sub.participationId })
    .then((participation) => {
        // Check prev sub
        participation = participation[0];
        multiset = true;
        if (participation.questions.length !== 0) {
            if (!participation.questions.includes(sub.questionId)) {
                multiset = false;
                return callback(null, participation);
            }
        }
        if (multiset) {
            found = false;
            updated = false;
            if (participation.submissionResults.length !== 0) {
                for (let i = 0; i < participation.submissionResults.length; i++) {
                    if (participation.submissionResults[i].questionId === sub.questionId) {
                        found = true;
                        if (participation.submissionResults[i].score < sub.score) {
                            // Update higher score
                            updated = true;
                            console.log("Came here");
                            DBParticipation.updateOne(
                            {
                                participationId: sub.participationId,
                                "submissionResults.questionId": sub.questionId,
                            },
                            {
                                $set: {
                                    "submissionResults.$.score": sub.score,
                                    "submissionResults.$.ipAddress": sub.ipAddress,
                                },
                            },
                            { new: true }
                            )
                            .then((participation) => {
                                if (!participation) {
                                    return callback("Participation not found with Id ",null);
                                }
                                return callback(null, participation);
                            })
                            .catch((err) => {
                                if (err.kind === "ObjectId") {
                                    return callback("Participation not found with Id ",null);
                                }
                                return callback("Error updating Participation with Id ",null);
                            });
                        }
                    }
                }
                if (found && !updated) {
                    return callback(null, participation);
                }
            }
            if (!found) {
            DBParticipation.findOneAndUpdate(
                { participationId: sub.participationId },
                {
                    $addToSet: {
                        submissionResults: {
                            questionId: sub.questionId,
                            score: sub.score,
                            ipAddress: sub.ipAddress,
                        },
                    },
                },
                { new: true }
            )
            .then((participation) => {
                if (!participation) {
                    return callback("Participation not found with Id ", null);
                }
                return callback(null, participation);
            })
            .catch((err) => {
                console.log(err);
                if (err.kind === "ObjectId") {
                    return callback("Participation not found with Id ", null);
                }
                return callback("Error updating Participation with Id ", null);
            });
        }
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({
            success: false,
            message:err.message || "Some error occurred while retrieving participation.",
        });
    });
};

// Retrieve and return all participations from the database.
exports.findAll = (req, res) => {
    DBParticipation.find()
    .then((participation) => {
        res.send(participation);
    })
    .catch((err) => {
        res.status(500).send({
            success: false,
            message:
            err.message || "Some error occurred while retrieving dbParticipation.",
        });
    });
};

// Retrieve and return all participation details for user in contest.
exports.findUser = (req, res) => {
    DBParticipation.find({
        participationId: req.decoded.username + req.params.dbSessionId,
    })
    .then((participation) => {
        res.send(participation);
    })
    .catch((err) => {
        res.status(500).send({
            success: false,
            message:
            err.message || "Some error occurred while retrieving dbParticipation.",
        });
    });
};

// Retrieve and return all participation details for user in contest.
exports.findParticipation = (req, callback) => {
    DBParticipation.find({
        participationId: req.decoded.username + req.params.dbSessionId,
    })
    .then((participation) => {
        if (participation.length === 0) {
            return callback("participation not found ", null);
        }
        participation = participation[0];
        return callback(null, participation);
    })
    .catch((err) => {
        return callback(err || "Error retrieving dbSession", null);
    });
};

  // Update a participation identified by the dbSessionId in the request
exports.updateParticipation = (req, questions, callback) => {
    DBParticipation.findOneAndUpdate(
        { participationId: req.decoded.username + req.params.dbSessionId },
        {
            $set: {
                questions: questions,
            },
        },
        { new: true }
    )
    .then((participation) => {
        if (!participation) {
            return callback("dbSession not found ", null);
        }
        participation = participation[0];
        return callback(null, participation);
    })
    .catch((err) => {
        if (err.kind === "ObjectId") {
            return callback("dbSession not found", null);
        }
        return callback("Error retrieving contest", null);
    });
};

// Retrieve and return all participation details.
exports.findContestPart = (req, res) => {
    DBParticipation.find({ dbSessionId: req.body.dbSessionId })
    .then((participation) => {
        res.send(participation);
    })
    .catch((err) => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving participation.",
        });
    });
};

// Retrieve user participation time.
exports.findUserTime = (result, callback) => {
    DBParticipation.find({ participationId: result.participationId })
    .then((participation) => {
        if (!participation) {
            return callback("Couldn't find dbParticipation", null);
        }
        return callback(null, participation);
    })
    .catch((err) => {
        if (err.kind === "ObjectId") {
            return callback("Couldn't find dbParticipation, caught exception",null);
        }
        return callback("Error retrieving data(DB Part)", null);
    });
};

