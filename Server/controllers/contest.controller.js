const Contest = require('../models/contest.model.js');

// Create and Save a new contest
exports.create = (req, res) => {
    // Validate request
    if(!req.body.contestId) {
        return res.status(400).send({
            message: "ContestId can not be empty"
        });
    }

    if(!req.body.contestName) {
        return res.status(400).send({
            message: "Contestname can not be empty"
        });
    }

    // Create a Contest
    const contest = new Contest({
        contestId: req.body.contestId,
        contestName: req.body.contestName,
        contestDate: req.body.contestDate,
        contestDuration: req.body.contestDuration,
        contestStartTime: req.body.contestStartTime,
        questions: [{
            questionId: req.body.questionId1,
            questionName: req.body.questionName1
        },
        {
            questionId: req.body.questionId2,
            questionName: req.body.questionName3
        },
        {
            questionId: req.body.questionId3,
            questionName: req.body.questionName3
        },
        {
            questionId: req.body.questionId4,
            questionName: req.body.questionName4
        },
        {
            questionId: req.body.questionId5,
            questionName: req.body.questionName5
        },
        {
            questionId: req.body.questionId6,
            questionName: req.body.questionName6
        },
        {
            questionId: req.body.questionId7,
            questionName: req.body.questionName7
        },
        {
            questionId: req.body.questionId8,
            questionName: req.body.questionName8
        },
        {
            questionId: req.body.questionId9,
            questionName: req.body.questionName9
        },
        {
            questionId: req.body.questionId10,
            questionName: req.body.questionName10
        },
        {
            questionId: req.body.questionId11,
            questionName: req.body.questionName11
        },
        {
            questionId: req.body.questionId12,
            questionName: req.body.questionName12
        },
        {
            questionId: req.body.questionId13,
            questionName: req.body.questionName13
        },
        {
            questionId: req.body.questionId14,
            questionName: req.body.questionName14
        },
        {
            questionId: req.body.questionId15,
            questionName: req.body.questionName15
        }
    ]
      });

    // Save Note in the database
    contest.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Contest."
        });
    });
};

// Retrieve and return all contests from the database.
exports.findAll = (req, res) => {
    Contest.find()
    .then(contests => {
        res.send(contests);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving contests."
        });
    });
};

// Find a single contest with a contestId
exports.findOne = (req, res) => {
    Contest.findById(req.params.contestId)
    .then(contest => {
        if(!contest) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.contestId
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.contestId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.contestId
        });
    });
};

// Update a contest identified by the contestId in the request
exports.update = (req, res) => {
    if(!req.body.contestId) {
        return res.status(400).send({
            message: "content can not be empty"
        });
    }

    // Find note and update it with the request body
    Note.findByIdAndUpdate(req.params.contestId, {
        contestId: req.body.contestId,
        contestName: req.body.contestName,
        contestDate: req.body.contestDate,
        contestDuration: req.body.contestDuration,
        contestStartTime: req.body.contestStartTime,
        questions: [{
            questionId: req.body.questionId1,
            questionName: req.body.questionName1
        },
        {
            questionId: req.body.questionId2,
            questionName: req.body.questionName3
        },
        {
            questionId: req.body.questionId3,
            questionName: req.body.questionName3
        },
        {
            questionId: req.body.questionId4,
            questionName: req.body.questionName4
        },
        {
            questionId: req.body.questionId5,
            questionName: req.body.questionName5
        },
        {
            questionId: req.body.questionId6,
            questionName: req.body.questionName6
        },
        {
            questionId: req.body.questionId7,
            questionName: req.body.questionName7
        },
        {
            questionId: req.body.questionId8,
            questionName: req.body.questionName8
        },
        {
            questionId: req.body.questionId9,
            questionName: req.body.questionName9
        },
        {
            questionId: req.body.questionId10,
            questionName: req.body.questionName10
        },
        {
            questionId: req.body.questionId11,
            questionName: req.body.questionName11
        },
        {
            questionId: req.body.questionId12,
            questionName: req.body.questionName12
        },
        {
            questionId: req.body.questionId13,
            questionName: req.body.questionName13
        },
        {
            questionId: req.body.questionId14,
            questionName: req.body.questionName14
        },
        {
            questionId: req.body.questionId15,
            questionName: req.body.questionName15
        }]
      }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Contest not found with id " + req.params.contestId
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Contest not found with id " + req.params.contestId
            });                
        }
        return res.status(500).send({
            message: "Error updating Contest with id " + req.params.contestId
        });
    });
};

// Delete a contest with the specified contestId in the request
exports.delete = (req, res) => {
    Contest.findByIdAndRemove(req.params.contestId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "contest not found with id " + req.params.contestId
            });
        }
        res.send({message: "contest deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "contest not found with id " + req.params.contestId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.contestId
        });
    });
};