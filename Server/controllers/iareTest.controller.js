const IareTest = require("../models/iareTest.model.js");
const section = require("../models/section.model.js");

// Create and Save a new iareTest
exports.create = (req, res) => {
  // Validate request
  if (!req.body.testId || !req.body.testName) {
    return res.status(400).send({
      success: false,
      message: "Input fields can not be empty",
    });
  }

  // Create a iareTest
  const iareTest = new IareTest({
    testId: req.body.testId,
    testName: req.body.testName,
  });

  // Save iareTest in the database
  iareTest
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while creating the IareTest.",
      });
    });
};

// Retrieve and return all iareTests from the database.
exports.findAll = (req, res) => {
  IareTest.find()
    .then((iareTests) => {
      res.send(iareTests);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving iareTests.",
      });
    });
};

// Find a single iareTest with a testId
exports.findOne = (req, res) => {
  IareTest.find({
      testId: req.params.testId
    })
    .then((iareTest) => {
      if (!iareTest) {
        return res.status(404).send({
          success: false,
          message: "IareTest not found with id " + req.params.testId,
        });
      }
      res.send(iareTest);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "IareTest not found with id " + req.params.testId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving iareTest with id " + req.params.testId,
      });
    });
};

// Update a iareTest identified by the testId in the request
exports.update = (req, res) => {
  if (!req.body.testId) {
    return res.status(400).send({
      success: false,
      message: "content can not be empty",
    });
  }
  // Find iareTest and update it with the request body
  IareTest.findOneAndUpdate({
        testId: req.body.testId
      }, {
        $set: {
          testId: req.body.testId,
          testName: req.body.testName,
        },
      }, {
        new: true
      },
      (err, doc) => {
        if (err) {
          console.log("Error Occured");
        }
      }
    )
    .then((iareTest) => {
      if (!iareTest) {
        return res.status(404).send({
          success: false,
          message: "IareTest not found with id " + req.body.testId,
        });
      }
      res.send(iareTest);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "IareTest not found with id " + req.body.testId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating iareTest with id " + req.body.testId,
      });
    });
};

// Delete a iareTest with the specified testId in the request
exports.delete = (req, res) => {
  IareTest.findOneAndRemove({
      testId: req.params.testId
    })
    .then((iareTest) => {
      if (!iareTest) {
        return res.status(404).send({
          success: false,
          message: "IareTest not found with id " + req.params.testId,
        });
      }
      res.send({
        message: "iareTest deleted successfully!"
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "IareTest not found with id " + req.params.testId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not deleteIareTest with id " + req.params.testId,
      });
    });
};