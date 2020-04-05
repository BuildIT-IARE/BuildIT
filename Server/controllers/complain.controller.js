const Complain = require("../models/complain.model.js");

exports.create = (req, res) => {
  if (!req.body.complainId) {
    return res.status(400).send({
      success: false,
      message: "ComplainId can not be empty",
    });
  }
  if (!req.body.complainSubject) {
    return res.status(400).send({
      success: false,
      message: "Complain Subject can not be empty",
    });
  }
  if (!req.body.complainDesc) {
    return res.status(400).send({
      success: false,
      message: "Complain Description can not be empty",
    });
  }
  if (!req.body.questionId) {
    return res.status(400).send({
      success: false,
      message: "QuestionId can not be empty",
    });
  }

  // Create a Complain
  const complain = new Complain({
    complainId: req.body.complainId,
    complainSubject: req.body.complainSubject,
    username: req.body.username,
    complainDesc: req.body.complainDesc,
    questionId: req.body.questionId,
  });

  // Save Complain in the database
  complain
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while creating the Complain.",
      });
    });
};

// Retrieve and return all Complains from the database.
exports.findAll = (req, res) => {
  Complain.find()
    .then((complains) => {
      res.send(complains);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving complains.",
      });
    });
};
// delete w/ questionId
exports.delete = (req, res) => {
  Complain.findOneAndRemove({ questionId: req.params.questionId })
    .then((complain) => {
      if (!complain) {
        return res.status(404).send({
          success: false,
          message: "q not found with id " + req.params.questionId,
        });
      }
      res.send({ success: true, message: "complaint deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "q not found with id " + req.params.questionId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not delete user with id " + req.params.questionId,
      });
    });
};
