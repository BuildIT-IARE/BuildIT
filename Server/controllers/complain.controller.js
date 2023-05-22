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
      for (let i = 0; i < complains.length; i++) {
          complains[i]._doc.createdAt = complains[i]._id.getTimestamp();
      }
      res.send(complains);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving complains.",
      });
    });
};
// delete w/ questionId
exports.delete = (req, res) => {
  Complain.findOneAndRemove({ complainId: req.params.complainId })
    .then((complain) => {
      if (!complain) {
        return res.status(404).send({
          success: false,
          message: "question not found with id " + req.params.questionId,
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

// update w/ questionId
exports.update = (req, res) => {
  Complain.findOneAndUpdate(
    { complainId: req.params.complainId },
    {
      resolutionStatus: req.body.resolutionStatus,
      resolutionRemarks: req.body.resolutionRemarks,
    }
  )
    .then((complain) => {
      if (!complain) {
        return res.status(404).send({
          success: false,
          message: "complain not found with id " + req.params.questionId,
        });
      }
      res.send({ success: true, message: "complaint updated successfully!" });
    })
    .catch((err) => {
      console.log(err);
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "complain not found with id " + req.params.questionId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not update complain with id " + req.params.questionId,
      });
    });
};



exports.findOne = (req, res) => {
  Complain.findOne({ complainId: req.params.complainId })
  .then((complain) => {
    if (!complain) {
      return res.status(404).send({
        success: false,
        message: "complaint not found with id " + req.params.complainId,
      });
    }
    // add createdAt if not exist
    console.log(complain._doc.resolutionStatus === true);
    if (complain._doc.resolutionStatus === true){
      return res.status(404).send({
        success: false,
        message: "complain already resolved",
      })
    }else{
        complain._doc.createdAt = complain._id.getTimestamp();
      res.send(complain);
    }
  })
  .catch((err) => {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        success: false,
        message: "complain not found with id " + req.params.complainId,
      });
    }
    return res.status(500).send({
      success: false,
      message: "Error retrieving complain with id " + req.params.complainId,
    });
  })
}