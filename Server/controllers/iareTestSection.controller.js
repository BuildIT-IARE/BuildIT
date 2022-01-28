const IareTestSection = require("../models/iareTestSection.model.js");

// Create and Save a new iareTestSection
exports.create = (req, res) => {
    // Validate request
    if (!req.body.iareTestId) {
        return res.status(400).send({
            success: false,
            message: "Course Id can not be empty",
        });
    }

    if (!req.body.iareTestSectionId) {
        return res.status(400).send({
            success: false,
            message: "Section Id can not be empty",
        });
    }

    if (!req.body.iareTestSectionName) {
        return res.status(400).send({
            success: false,
            message: "Section name can not be empty",
        });
    }

    // Create a iareTestSection
    const iareTestSection = new IareTestSection({
        iareTestId: req.body.iareTestId,
        iareTestSectionId: req.body.iareTestSectionId,
        iareTestSectionName: req.body.iareTestSectionName,
    });

    // Save iareTestSection in the database
    iareTestSection
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating the IareTestSection.",
            });
        });
};

exports.findAllTestId = (req,res) => {
    IareTestSection.find({
        iareTestId:req.body.iareTestId,
    }).then((iareTestSections) => {
        res.send(iareTestSections);
    })
    .catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving iareTestSections.",
        });
    });
}

// Retrieve and return all iareTestSections from the database.
exports.findAll = (req, res) => {
    IareTestSection.find()
        .then((iareTestSections) => {
            res.send(iareTestSections);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving iareTestSections.",
            });
        });
};

// Find a single iareTestSection with a iareTestSectionId
exports.findOne = (req, res) => {
    IareTestSection.find({
            iareTestSectionId: req.params.iareTestSectionId
        })
        .then((iareTestSection) => {
            if (!iareTestSection) {
                return res.status(404).send({
                    success: false,
                    message: "IareTestSection not found with id " + req.params.iareTestSectionId,
                });
            }
            res.send(iareTestSection);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    success: false,
                    message: "IareTestSection not found with id " + req.params.iareTestSectionId,
                });
            }
            return res.status(500).send({
                success: false,
                message: "Error retrieving iareTestSection with id " + req.params.iareTestSectionId,
            });
        });
};

// Update a iareTestSection identified by the iareTestSectionId in the request
exports.update = (req, res) => {
    if (!req.body.iareTestSectionId) {
        return res.status(400).send({
            success: false,
            message: "content can not be empty",
        });
    }
    // Find iareTestSection and update it with the request body
    IareTestSection.findOneAndUpdate({
                iareTestSectionId: req.body.iareTestSectionId
            }, {
                $set: {
                    iareTestSectionId: req.body.iareTestSectionId,
                    iareTestSectionName: req.body.iareTestSectionName,
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
        .then((iareTestSection) => {
            if (!iareTestSection) {
                return res.status(404).send({
                    success: false,
                    message: "IareTestSection not found with id " + req.body.iareTestSectionId,
                });
            }
            res.send(iareTestSection);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    success: false,
                    message: "IareTestSection not found with id " + req.body.iareTestSectionId,
                });
            }
            return res.status(500).send({
                success: false,
                message: "Error updating iareTestSection with id " + req.body.iareTestSectionId,
            });
        });
};

// Delete a iareTestSection with the specified iareTestSectionId in the request
exports.delete = (req, res) => {
    IareTestSection.findOneAndRemove({
            iareTestSectionId: req.params.iareTestSectionId
        })
        .then((iareTestSection) => {
            if (!iareTestSection) {
                return res.status(404).send({
                    success: false,
                    message: "IareTestSection not found with id " + req.params.iareTestSectionId,
                });
            }
            res.send({
                message: "iareTestSection deleted successfully!"
            });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    success: false,
                    message: "IareTestSection not found with id " + req.params.iareTestSectionId,
                });
            }
            return res.status(500).send({
                success: false,
                message: "Could not deleteIareTestSection with id " + req.params.iareTestSectionId,
            });
        });
};