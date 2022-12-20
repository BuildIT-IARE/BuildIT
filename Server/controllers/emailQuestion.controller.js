const EmailQuestion = require("../models/emailQuestion.model.js");

exports.create = (req, res) => {
  const question = new EmailQuestion({
    emailId: req.body.emailId,
    emailQuestionId: req.body.emailQuestionId,
    emailQuestionName: req.body.emailQuestionName,
    emailTopic: req.body.emailTopic,
    emailScore: Number(req.body.emailScore),
    emailGuidelines: req.body.emailGuidelines,
  });

  question
    .save()
    .then((data) => {
      res.status(200).send({
        success: true,
        message: "Question Created Successfully",
      });
    })
    .catch((err) => {
      res.status(500).send(err.message || "Error Creating an Email Question");
    });
};

//extract all questions
exports.findAll = (req, res) => {
  EmailQuestion.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send(
          "Error while retrieving questions of Contest Id " + req.body.emailId
        );
    });
};

//find one question
exports.findOne = (req, res) => {
  EmailQuestion.find({ emailQuestionId: req.params.emailQuestionId })
    .then((data) => {
      data = data[0];
      res.status(200).send({
        success: true,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          "Error fetching Question with Email Question Id " +
          req.body.emailQuestionId,
      });
    });
};

//delete a question
exports.delete = (req, res) => {
  EmailQuestion.remove(
    { emailQuestionId: req.params.emailQuestionId },
    {
      justOne: true,
    }
  )
    .then((data) => {
      res.status(200).send("Question successfully deleted");
    })
    .catch((err) => {
      res.status(500).send("Could not Delete QUestion due to " + err.message);
    });
};

exports.emailSessionQuestions = (req, res) => {
  EmailQuestion.find({
    emailId: req.params.emailId,
  })
    .then((questions) => {
      if (questions.length > 0) {
        res.send({
          success: true,
          data: questions,
        });
      } else {
        res.send({
          success: false,
          data: questions,
          message: "No Questions Availble in the Session",
        });
      }
    })
    .catch((err) => {
      res.send({
        success: false,
        data: null,
        message: "Error while retriving the Questions",
      });
    });
};
