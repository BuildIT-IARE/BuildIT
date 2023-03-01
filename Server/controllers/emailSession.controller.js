const Email = require("../models/emailSession.model.js");
const encrypt = require("../encrypt.js");

//create a email
exports.create = (req, res) => {
  if (!req.body.emailId) {
    return res.status(400).send({
      success: false,
      message: "emailId can not be empty",
    });
  }
  if (!req.body.emailName) {
    return res.status(400).send({
      success: false,
      message: "email name can not be empty",
    });
  }
  // let encryptValue = encrypt.encrypt(req.body.facultyId);
  let facId = encrypt.decrypt(req.body.facultyId);
  Email.find({})
    .then((emails) => {
      if (!emails) {
        return res.status(500).send({
          success: false,
          message: "No emails found(create)",
        });
      }
      emails = emails[0];
      Email.findOneAndUpdate(
        { emailId: emails.emailId },
        {
          $set: {
            CountValue: emails.CountValue + 1,
          },
        },
        { new: true }
      )
        .then()
        .catch((err) => {
          return res.status(500).send({
            success: false,
            message:
              err.message || "First Reference emailSession missing(CountValue)",
          });
        });
      const email = new Email({
        emailId: "IARE_ES" + emails.CountValue + 1,
        emailName: req.body.emailName,
        emailDate: req.body.emailDate,
        emailFaculty: req.body.emailFaculty,
        facultyId: facId,
        emailStartDay: req.body.emailStartDay,
        emailEndDay: req.body.emailEndDay,
        emailStartTime: req.body.emailStartTime,
        emailEndTime: req.body.emailEndTime,
        emailPassword: req.body.emailPassword,
      });
      email
        .save()
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            success: false,
            message:
              err.message +
              " Some error occurred while creating the emailSession.",
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        message:
          err.message ||
          "Some error occurred while retrieving emaiSessions(create).",
      });
    });
  Email.find({})
  .then((data) => {
    var CountValue = data[0].CountValue;
    const email = new Email({
      emailId: "IARE "+CountValue,
      emailName: req.body.emailName,
      emailDate: req.body.emailDate,
      emailFaculty: req.body.emailFaculty,
      facultyId: req.body.facultyId,
      emailStartDay: req.body.emailStartDay,
      emailEndDay: req.body.emailEndDay,
      emailStartTime: req.body.emailStartTime,
      emailEndTime: req.body.emailEndTime,
      emailPassword: req.body.emailPassword,
    });
    email
      .save()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: err.message + " Some error occurred while creating the email.",
        });
      });
  })
  .catch((err) => {
    res.status(500).send({
      success: false,
      message: err.message + " Some error occurred while creating the email.",
    });
  });
};

// Find a single  with a Id
exports.findOne = (req, res) => {
  Email.find({ emailId: req.params.emailId })
    .then((email) => {
      if (!email) {
        return res.status(404).send({
          success: false,
          message: "Email not found with id " + req.params.emailId,
        });
      }
      email = email[0];
      res.status(200).send(email);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Email not found with id " + req.params.emailId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving  with id " + req.params.emailId,
      });
    });
};

// Find All emails
exports.findAllSession = (req, res) => {
  Email.find({})
    .then((emails) => {
      emails.shift();
      res.status(200).send(emails);
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        message: "Error retrieving emails" || err.message,
      });
    });
};

exports.findAll = (req, res) => {
  var encryptName = encrypt.encrypt(req.params.facultyId);
  Email.find({ facultyId: req.params.facultyId })
    .then((emails) => {
      res.status(200).send({
        success: true,
        data: emails,
        facultyEmail: encryptName,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        message: "Error retrieving emails" || err.message,
      });
    });
};

// Update a email
exports.update = (req, res) => {
  if (!req.body.emailId) {
    return res.status(400).send({
      success: false,
      message: "emailId can not be empty",
    });
  }
  Email.findOneAndUpdate(
    { emailId: req.params.emailId },
    {
      $set: {
        emailName: req.body.emailName,
        emailDuration: req.body.emailDuration,
        emailStartDay: req.body.emailStartDay,
        emailEndDay: req.body.emailEndDay,
        emailFaculty: req.body.emailFaculty,
        emailStartTime: req.body.emailStartTime,
        emailEndTime: req.body.emailEndTime,
      },
    },
    { upsert: true }
  )
    .then((email) => {
      if (!email) {
        return res.status(404).send({
          success: false,
          message: "email not found with id " + req.body.emailId,
        });
      }
      res.status(200).send(email);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: " not found with id " + req.body.emailId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating Email with id " + req.body.emailId,
      });
    });
};

// Delete email
exports.delete = (req, res) => {
  Email.findOneAndRemove({ emailId: req.params.emailId })
    .then((email) => {
      if (!email) {
        return res.status(404).send({
          success: false,
          message: "email not found with id " + req.params.email,
        });
      }
      res.send({ message: "email deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "email not found with id " + req.params.emailId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not delete email with id " + req.params.emailId,
      });
    });
};

exports.checkEmailPassword = (req, res) => {
  if (req.body.username.toLowerCase() === req.body.rollNumber.toLowerCase()) {
    Email.findOne({ emailId: req.body.emailId })
      .then((data) => {
        if (data.emailPassword === req.body.password) {
          res.status(200).send({
            success: true,
            emailId: req.body.emailId,
          });
        } else {
          res.status(200).send({
            success: false,
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: err.message,
        });
      });
  } else {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
