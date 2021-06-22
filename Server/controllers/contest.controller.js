const Contest = require("../models/contest.model.js");

// Create and Save a new contest
exports.create = (req, res) => {
  // Validate request
  if (!req.body.contestId) {
    return res.status(400).send({
      success: false,
      message: "ContestId can not be empty",
    });
  }

  if (!req.body.contestName) {
    return res.status(400).send({
      success: false,
      message: "Contestname can not be empty",
    });
  }

  // Create a Contest
  const contest = new Contest({
    contestId: req.body.contestId,
    contestName: req.body.contestName,
    contestDate: req.body.contestDate,
    contestDuration: req.body.contestDuration,
    contestStartTime: req.body.contestStartTime,
    contestEndTime: req.body.contestEndTime,
    mcq: req.body.mcq,
  });

  // SaveContest in the database
  contest
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while creating the Contest.",
      });
    });
};

// Retrieve and return all contests from the database.
exports.findAll = (req, res) => {
  if (req.body.mcq === undefined) {
    Contest.find({})
      .then((contests) => {
        res.send(contests);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving contests.",
        });
      });
  } else {
    Contest.find({ mcq: req.body.mcq ? true : { $in: [false, null] } })
      .then((contests) => {
        res.send(contests);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving contests.",
        });
      });
  }
};

// Find a single contest with a contestId
exports.findOne = (req, res) => {
  Contest.find({ contestId: req.params.contestId })
    .then((contest) => {
      if (!contest) {
        return res.status(404).send({
          success: false,
          message: "Contest not found with id " + req.params.contestId,
        });
      }
      res.send(contest);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Contest not found with id " + req.params.contestId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving contest with id " + req.params.contestId,
      });
    });
};

// Find a single contest with a contestId for checking duration
exports.getDuration = (req, callback) => {
  Contest.find({ contestId: req.body.contestId })
    .then((contest) => {
      if (!contest) {
        return callback("Contest not found ", null);
      }
      contest = contest[0];
      let durationData = {
        startTime: contest.contestStartTime,
        endTime: contest.contestEndTime,
        duration: contest.contestDuration,
        date: contest.contestDate,
      };
      return callback(null, durationData);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return callback("Contest not found", null);
      }
      return callback("Error retrieving contest", null);
    });
};

// Find a single contest with a contestId for checking multiset
exports.findOneSet = async (req, callback) => {
  Contest.find({ contestId: req.params.contestId })
    .then((contest) => {
      if (!contest) {
        return callback("Contest not found ", null);
      }
      contest = contest[0];
      return callback(null, contest);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return callback("Contest not found", null);
      }
      return callback("Error retrieving contest", null);
    });
};

// Update a single contest with a contestId
exports.updateOneSet = (req, sets, callback) => {
  Contest.findOneAndUpdate(
    { contestId: req.params.contestId },
    {
      $set: {
        multiset: true,
        sets: sets
      },
    },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("Error Occured");
      }
    }
  )
    .then((contest) => {
      if (!contest) {
        return callback("Contest not found ", null);
      }
      contest = contest[0];
      return callback(null, contest);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return callback("Contest not found", null);
      }
      return callback("Error retrieving contest", null);
    });
};

// Update a contest identified by the contestId in the request
exports.update = (req, res) => {
  if (!req.body.contestId) {
    return res.status(400).send({
      success: false,
      message: "content can not be empty",
    });
  }
  // Findcontest and update it with the request body
  Contest.findOneAndUpdate(
    { contestId: req.body.contestId },
    {
      $set: {
        contestId: req.body.contestId,
        contestName: req.body.contestName,
        contestDate: req.body.contestDate,
        contestDuration: req.body.contestDuration,
        contestStartTime: req.body.contestStartTime,
        contestEndTime: req.body.contestEndTime,
      },
    },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("Error Occured");
      }
    }
  )
    .then((contest) => {
      if (!contest) {
        return res.status(404).send({
          success: false,
          message: "Contest not found with id " + req.body.contestId,
        });
      }
      res.send(contest);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Contest not found with id " + req.body.contestId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating Contest with id " + req.body.contestId,
      });
    });
};

// Delete a contest with the specified contestId in the request
exports.delete = (req, res) => {
  Contest.findOneAndRemove({ contestId: req.params.contestId })
    .then((contest) => {
      if (!contest) {
        return res.status(404).send({
          success: false,
          message: "contest not found with id " + req.params.contestId,
        });
      }
      res.send({ message: "contest deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "contest not found with id " + req.params.contestId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not deletecontest with id " + req.params.contestId,
      });
    });
};
