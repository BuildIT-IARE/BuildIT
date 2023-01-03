const EmailSubmission = require("../models/emailSubmission.model.js");
var moment = require("moment");

//Create a Submission
exports.create = (req, res) => {
  var comments = "";
  var score = 0;
  const Submission = new EmailSubmission({
    emailId: req.body.emailId,
    emailQuestionId: req.body.emailQuestionId,
    emailSubmissionId: req.body.emailId + req.body.emailQuestionId,
    rollNumber: req.body.rollNumber,
    emailSource: req.body.emailSource,
    emailSubject: req.body.emailSubject,
    facultyComments: comments,
    score: score,
    submissionTime: moment(),
    evaluated: false,
    emailScore: req.body.emailScore,
    emailName: req.body.emailName,
  });
  Submission.save()
    .then((data) => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      res.status(500).send({ success: false });
    });
};

//find all submissions of a question of a session
exports.findAllSession = (req, res) => {
  EmailSubmission.find({ emailSubmissionId: req.params.emailSubmissionId })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send("Error retrieving submissions");
    });
};

//find one submission
exports.findOne = (req, res) => {
  EmailSubmission.findOne({ emailSubmissionId: req.params.emailSubmissionId })
    .then((data) => {
      if (data) {
        res.status(200).send({
          success: true,
          data: data,
        });
      } else {
        res.status(500).send({
          success: false,
          message: "No Submissions Available",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Error Retriving data",
      });
    });
};

//find all submissions based on roll number
exports.findAllRollNumber = (req, res) => {
  EmailSubmission.find({ rollNumber: req.params.rollNumber })
    .then((data) => {
      res.send({
        data: data,
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error while retrieving submissions",
        success: false,
      });
    });
};

//Evaluate Submission
exports.evalSubmission = (req, res) => {
  var comments = req.body.facultyComments;
  var score = req.body.score;
  EmailSubmission.findOneAndUpdate(
    {
      emailSubmissionId: req.params.emailSubmissionId,
      rollNumber: req.params.rollNumber,
    },
    {
      $set: {
        facultyComments: comments,
        score: score,
        evaluated: true,
      },
    },
    { upsert: true }
  )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send("Error Evaluating Submission");
    });
};

exports.findOneStatementRollNumber = async (req, res) => {
  EmailSubmission.findOne({
    emailSubmissionId: req.params.emailSubmissionId,
    rollNumber: req.params.rollNumber,
  })
    .then((submission) => {
      if (submission) {
        res.send({
          success: true,
          data: submission,
        });
      } else {
        res.send({
          success: false,
          data: submission,
        });
      }
    })
    .catch((err) => {
      res.send({
        success: false,
        message: "Failed to retrive Submission",
      });
    });
};
