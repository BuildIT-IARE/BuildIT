const Participation = require('../models/participation.model.js');

// Create and Save a new contest
exports.create = (req, res) => {
    // Validate request
    if(!req.body.participationId) {
        return res.status(400).send({
            message: "Participation Id can not be empty"
        });
    }

    if(!req.body.contestId) {
        return res.status(400).send({
            message: "Contest Id can not be empty"
        });
    }

    // Create a Participation
    const participation = new Participation({
        userId: req.body.userId,
        contestId: req.body.contestId,
        participationTime: String(Date.now())
      });

    // SaveReg in the database
    participation.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while Registering."
        });
    });
};

// Retrieve and return all participations from the database.
exports.findAll = (req, res) => {
    Participation.find()
    .then(participation => {
        res.send(participation);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving participation."
        });
    });
};