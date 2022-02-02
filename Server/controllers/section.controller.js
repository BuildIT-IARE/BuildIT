const Section = require("../models/section.model.js");

// Create and Save a new section
exports.create = (req, res) => {
  // Validate request
  if (!(req.body.contestId && req.body.sectionId && req.body.sectionName)) {
    return res.status(400).send({
      success: false,
      message: "Input fields can not be empty",
    });
  }

  // Create a section
  const section = new Section({
    contestId: req.body.contestId,
    sectionId: req.body.sectionId,
    sectionName: req.body.sectionName,
  });

  // Save section in the database
  section
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while creating the section.",
      });
    });
};

exports.findAllContest = (req, res) => {
  Section
    .find({
      contestId: req.params.contestId,
    })
    .then((sections) => {
      res.send(sections);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sections.",
      });
    });
};

// Retrieve and return all sections from the database.
exports.findAll = (req, res) => {
  Section
    .find()
    .then((sections) => {
      res.send(sections);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sections.",
      });
    });
};

// Find a single section with a sectionId
exports.findOne = (req, res) => {
  Section
    .find({
      sectionId: req.params.sectionId,
    })
    .then((section) => {
      if (!section) {
        return res.status(404).send({
          success: false,
          message: "section not found with id " + req.params.sectionId,
        });
      }
      res.send(section);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "section not found with id " + req.params.sectionId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving section with id " + req.params.sectionId,
      });
    });
};

// Update a section identified by the sectionId in the request
exports.update = (req, res) => {
  if (!req.body.sectionId) {
    return res.status(400).send({
      success: false,
      message: "content can not be empty",
    });
  }
  // Find section and update it with the request body
  Section
    .findOneAndUpdate(
      {
        sectionId: req.body.sectionId,
      },
      {
        $set: {
          sectionId: req.body.sectionId,
          sectionName: req.body.sectionName,
        },
      },
      {
        new: true,
      },
      (err, doc) => {
        if (err) {
          console.log("Error Occured");
        }
      }
    )
    .then((section) => {
      if (!section) {
        return res.status(404).send({
          success: false,
          message: "section not found with id " + req.body.sectionId,
        });
      }
      res.send(section);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "section not found with id " + req.body.sectionId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating section with id " + req.body.sectionId,
      });
    });
};

// Delete a section with the specified sectionId in the request
exports.delete = (req, res) => {
  Section
    .findOneAndRemove({
      sectionId: req.params.sectionId,
    })
    .then((section) => {
      if (!section) {
        return res.status(404).send({
          success: false,
          message: "section not found with id " + req.params.sectionId,
        });
      }
      res.send({
        message: "section deleted successfully!",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "section not found with id " + req.params.sectionId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not delete section with id " + req.params.sectionId,
      });
    });
};
