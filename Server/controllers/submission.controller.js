const Submission = require('../models/submission.model.js');
var moment = require('moment');


// Create and Save a new submission
exports.create = (req, result, callback) => {
    // Validate request
    if(!result.submissionToken) {
        return callback("Submission token can not be empty", null);
    }

    if(!result.username) {
        return callback("username can not be empty", null);
    }
    let date = moment();
    // Create a Submission
    const submission = new Submission({
        questionId: result.questionId,
        username: result.username,
        languageId: result.languageId,
        sourceCode: result.sourceCode,
        result: result.result,
        score: result.score,
        submissionToken: result.submissionToken,
        submissionTime: moment()
      });

    // SaveReg in the database
    submission.save()
    .then(data => {
        return callback(null, data);
    }).catch(err => {
        return callback("Error occurred while Submitting.", null);
    });
};

// Retrieve and return all submissions from the database.
exports.findAll = (req, res) => {
    Submission.find({questionId: req.params.questionId})
    .then(submission => {
        res.send(submission);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving submission."
        });
    });
};

exports.findUser = (req, res) => {
    Submission.find({username: req.params.username, questionId: req.params.questionId})
    .then(submission => {
        res.send(submission);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving submission."
        });
    });
};
