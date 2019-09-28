const Participation = require('../models/participation.model.js');

// Create and Save a new participation
exports.create = (req, res) => {
    // Validate request
    if(!req.body.participationId) {
        return res.status(400).send({
            message: "Participation Id can not be empty"
        });
    }

    if(!req.body.participationId) {
        return res.status(400).send({
            message: "Participation Id can not be empty"
        });
    }

    // Create a Participation
    const participation = new Participation({
        participationId: req.body.userId + req.body.contestId,
        userId: req.body.userId,
        contestId: req.body.contestId,
        participationTime: String(Date.now()),
        acceptedSubmissions: 0
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

// add sol to participation
exports.acceptSubmission = (req, res) => {
    if(!req.body.participationId) {
        return res.status(400).send({
            message: "id can not be empty"
        });
    }

    // Find participation and update it with the request body
    Participation.findOneAndUpdate({participationId: req.params.participationId}, {$inc:{
        acceptedSubmissions: 1
      }}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
      })
    .then(participation => {
        if(!participation) {
            return res.status(404).send({
                message: "Participation not found with id " + req.params.participationId
            });
        }
        res.send(participation);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Participation not found with id " + req.params.participationId
            });                
        }
        return res.status(500).send({
            message: "Error updating Participation with id " + req.params.participationId
        });
    });
};


// add score to participation
// exports.addScore = (req, res) => {
//     if(!req.body.participationId) {
//         return res.status(400).send({
//             message: "id can not be empty"
//         });
//     }

//     // Find participation and update it with the request body
//     Participation.findOneAndUpdate({participationId: req.params.participationId}, {$inc:{
//         acceptedSubmissions: 1
//       }}, {new: true}, (err, doc) => {
//         if (err) {
//             console.log("Something wrong when updating data!");
//         }
//         console.log(doc);
//       })
//     .then(participation => {
//         if(!participation) {
//             return res.status(404).send({
//                 message: "Participation not found with id " + req.params.participationId
//             });
//         }
//         res.send(participation);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "Participation not found with id " + req.params.participationId
//             });                
//         }
//         return res.status(500).send({
//             message: "Error updating Participation with id " + req.params.participationId
//         });
//     });
// };

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