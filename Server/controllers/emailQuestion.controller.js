const EmailQuestion = require("../models/emailQuestion.model.js");

exports.create = (req, res) => {
  EmailQuestion.find({})
  .then((emailQuestions) => {
    emailQuestions = emailQuestions[0];
    console.log(emailQuestions);
    EmailQuestion.findOneAndUpdate(
      {emailQuestionId : emailQuestions.emailQuestionId},
      {
        $set: {
          countValue : Number(emailQuestions.countValue) + 1
        }
      }
    )
    .then()
    .catch((err) => {
      return  res.status(500).send({
        success: false,
        message:
          err.message || "First Reference emailQuestion missing(countValue)",
      });
    });
    const question = new EmailQuestion({
      emailId: req.body.emailId,
      emailQuestionId: "IARE_EQ"+emailQuestions.countValue + 1,
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
          message: "emailQuestion Created Successfully",
        });
      })
      .catch((err) => {
        res.status(500).send(err.message || "Error Creating an emailQuestion");
      });
  })
  .catch((err) => {
    res.status(500).send({
      success: false,
      message:
        err.message || "Some error occurred while retrieving emailQuestions(create).",
    });
  });
};

exports.update = (req, res) => {
  EmailQuestion.findOneAndUpdate(
    {emailQuestionId: req.params.emailQuestionId},
    {
      $set : {
        emailId: req.body.emailId,
        emailQuestionName: req.body.emailQuestionName,
        emailTopic: req.body.emailTopic,
        emailScore: Number(req.body.emailScore),
        emailGuidelines: req.body.emailGuidelines,
      },
    },
    {new: true}
  )
  .then((email) => {
    if (!email) {
      return res.status(404).send({
        success: false,
        message: "emailQuestion not found with id " + req.params.emailId,
      });
    }
    return res.status(200).send({
      success: true,
      message: "emailQuestion updated! " + req.params.emailId,
    });
  })
  .catch((err) => {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        success: false,
        message: "emailQuestion not found with id " + req.params.emailId,
      });
    }
    return res.status(500).send({
      success: false,
      message: "Error updating emailQuestion with id " + req.params.emailId,
    });
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
