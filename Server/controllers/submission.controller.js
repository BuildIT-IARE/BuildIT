const Submission = require('../models/submission.model.js');

// Create and Save a new contest
exports.create = (req, res) => {
    // Validate request
    if(!req.body.submissionToken) {
        return res.status(400).send({
            message: "Submission token can not be empty"
        });
    }

    if(!req.body.username) {
        return res.status(400).send({
            message: "username can not be empty"
        });
    }

    // Create a Submission
    const submission = new Submission({
        questionId: req.body.questionId,
        username: req.body.username,
        languageId: req.body.languageId,
        sourceCode: req.body.sourceCode,
        result: req.body.result,
        score: req.body.score,
        submissionToken: req.body.submissionToken,
        submissionTime: String(Date.now())
      });

    // SaveReg in the database
    submission.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while Registering."
        });
    });
};

// Retrieve and return all submissions from the database.
exports.findAll = (req, res) => {
    Submission.find({questionId: req.params.questionId})
    .then(submission => {
        res.send(submission);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving submission."
        });
    });
};

exports.findUser = (req, res) => {
    Submission.find({username: req.params.username})
    .then(submission => {
        res.send(submission);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving submission."
        });
    });
};