const IareTest = require("../models/iareTest.model.js");
const IareTestSection = require("../models/iareTestSection.model.js");

// Create and Save a new iareTest
exports.create = (req, res) => {
  // Validate request
  if (!req.body.iareTestId) {
    return res.status(400).send({
      success: false,
      message: "Course Id can not be empty",
    });
  }

  if (!req.body.iareTestName) {
    return res.status(400).send({
      success: false,
      message: "Course name can not be empty",
    });
  }

  // Create a iareTest
  const iareTest = new IareTest({
    iareTestId: req.body.iareTestId,
    iareTestName: req.body.iareTestName,
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

// Retrieve and return all iareTestSections from the database.
exports.findAllSections = (req, res) => {
  IareTestSection.find({
    iareTestId:req.params.iareTestId,
  })
    .then((iareTestSections) => {
      res.send(iareTestSections);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving iareTests.",
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

// Find a single iareTest with a iareTestId
exports.findOne = (req, res) => {
  IareTest.find({
      iareTestId: req.params.iareTestId
    })
    .then((iareTest) => {
      if (!iareTest) {
        return res.status(404).send({
          success: false,
          message: "IareTest not found with id " + req.params.iareTestId,
        });
      }
      res.send(iareTest);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "IareTest not found with id " + req.params.iareTestId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving iareTest with id " + req.params.iareTestId,
      });
    });
};

// Update a iareTest identified by the iareTestId in the request
exports.update = (req, res) => {
  if (!req.body.iareTestId) {
    return res.status(400).send({
      success: false,
      message: "content can not be empty",
    });
  }
  // Find iareTest and update it with the request body
  IareTest.findOneAndUpdate({
        iareTestId: req.body.iareTestId
      }, {
        $set: {
          iareTestId: req.body.iareTestId,
          iareTestName: req.body.iareTestName,
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
          message: "IareTest not found with id " + req.body.iareTestId,
        });
      }
      res.send(iareTest);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "IareTest not found with id " + req.body.iareTestId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating iareTest with id " + req.body.iareTestId,
      });
    });
};

// Delete a iareTest with the specified iareTestId in the request
exports.delete = (req, res) => {
  IareTest.findOneAndRemove({
      iareTestId: req.params.iareTestId
    })
    .then((iareTest) => {
      if (!iareTest) {
        return res.status(404).send({
          success: false,
          message: "IareTest not found with id " + req.params.iareTestId,
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
          message: "IareTest not found with id " + req.params.iareTestId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not deleteIareTest with id " + req.params.iareTestId,
      });
    });
};