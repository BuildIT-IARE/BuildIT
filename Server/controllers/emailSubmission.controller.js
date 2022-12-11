const EmailSubmission = require("../models/emailSubmission.model.js");
var moment = require("moment");

//Create a Submission
exports.create = (req,res) => {
    var comments = "";
    var score=0;
    const Submission = new EmailSubmission({
        emailId: req.body.emailId,
        emailQuestionId : req.body.emailQuestionId,
        emailSubmissionId : req.body.emailId + req.body.emailQuestionId,
        rollNumber: req.body.rollNumber,
        emailSource: req.body.emailSource,
        facultyComments: comments,
        score: score,
        submissionTime: moment(),
    });
    Submission.save()
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(500).send("Submission could not be created due to "+err.message);
    })
}

//find all submissions of a Session
exports.findAllSession = (req,res) => {
    EmailSubmission.find({emailId : req.params.emailId})
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(500).send("Error retrieving submissions");
    })
}

//find one submission
exports.findOne = (req,res) => {
    EmailSubmission.findOne({emailSubmissionId : req.params.emailSubmissionId})
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(500).send("Error retrieving Submission "+req.body.emailSubmissionId);
    })
}

//find all submissions (testing purpose)
exports.findAll = (req,res) => {
    EmailSubmission.find({})
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(500).send("Error while retrieving submissions")
    })
}

//Evaluate Submission
exports.evalSubmission = (req,res) => {
    var comments = req.body.facultyComments;
    var score = Number(req.body.score);
    EmailSubmission.findOneAndUpdate(
        {emailSubmissionId : req.params.emailSubmissionId},
        {
            $set : {
                facultyComments: comments,
                score:Number(score)
            }
        },
        {upsert : true}
    )
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(500).send("Error Evaluating Submission")
    })
}