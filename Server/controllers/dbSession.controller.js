const DB = require("../models/dbSession.model.js");

//create a dbSession
exports.create = (req, res) => {
  if (!req.body.dbSessionId) {
    return res.status(400).send({
      success: false,
      message: "dbSessionId can not be empty",
    });
  }
  if (!req.body.dbSessionName) {
    return res.status(400).send({
      success: false,
      message: "dbSessionName name can not be empty",
    });
  }
  // let encryptValue = encrypt.encrypt(req.body.facultyId);
  const dbSession = new DB({
    dbSessionId: req.body.dbSessionId,
    dbSessionName: req.body.dbSessionName,
    dbSessionDate: req.body.dbSessionDate,
    dbSessionStartDay: req.body.dbSessionStartDay,
    dbSessionEndDay: req.body.dbSessionEndDay,
    dbSessionStartTime: req.body.dbSessionStartTime,
    dbSessionEndTime: req.body.dbSessionEndTime,
    dbSessionPassword: req.body.dbSessionPassword,
  });
  dbSession
    .save()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message + " Some error occurred while creating the dbSession.",
      });
    });
};

// Find a single  with a Id
exports.findOne = (req, res) => {
  DB.find({ dbSessionId: req.params.dbSessionId })
    .then((dbSession) => {
      if (!dbSession) {
        return res.status(404).send({
          success: false,
          message: "Email not found with id " + req.params.dbSessionId,
        });
      }
      dbSession = dbSession[0];
      res.status(200).send({
        success: true,
        data: dbSession,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Email not found with id " + req.params.dbSessionId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving  with id " + req.params.dbSessionId,
      });
    });
};

// Find All dbSessions
exports.findAllSession = (req, res) => {
  DB.find({})
    .then((dbSessions) => {
      res.status(200).send({
        success: true,
        data: dbSessions,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        message: "Error retrieving dbSessions" || err.message,
      });
    });
};

// Update a email
exports.update = (req, res) => {
  if (!req.body.dbSessionId) {
    return res.status(400).send({
      success: false,
      message: "dbSessionId can not be empty",
    });
  }
  DB.findOneAndUpdate(
    { dbSessionId: req.params.dbSessionId },
    {
      $set: {
        dbSessionId: req.body.dbSessionId,
        dbSessionName: req.body.dbSessionName,
        dbSessionDate: req.body.dbSessionDate,
        dbSessionStartDay: req.body.dbSessionStartDay,
        dbSessionEndDay: req.body.dbSessionEndDay,
        dbSessionStartTime: req.body.dbSessionStartTime,
        dbSessionEndTime: req.body.dbSessionEndTime,
        dbSessionPassword: req.body.dbSessionPassword,
      },
    },
    { upsert: true }
  )
    .then((dbSession) => {
      if (!dbSession) {
        return res.status(404).send({
          success: false,
          message: "dbSession not found with id " + req.body.dbSessionId,
        });
      }
      res.status(200).send(dbSession);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: " not found with id " + req.body.dbSessionId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating dbSession with id " + req.body.dbSessionId,
      });
    });
};

// Delete email
exports.delete = (req, res) => {
  DB.findOneAndRemove({ dbSessionId: req.params.dbSessionId })
    .then((dbSession) => {
      if (!dbSession) {
        return res.status(404).send({
          success: false,
          message: "dbSession not found with id " + req.params.dbSessionId,
        });
      }
      res.send({ message: "dbSession deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "dbSession not found with id " + req.params.dbSessionId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not delete dbSession with id " + req.params.dbSessionId,
      });
    });
};

// Find a single dbSession with a dbSessionId for checking duration
exports.getDuration = (req, res) => {
  DB.find({ dbSessionId: req.body.dbSessionId })
    .then((dbSession) => {
      if (!dbSession) {
        return res.status(500).send({
          success: false,
          message: "Could not find dbSession with id " + req.body.dbSessionId,
        });
      }
      dbSession = dbSession[0];
      let durationData = {
        startTime: dbSession.dbSessionStartTime,
        endTime: dbSession.dbSessionEndTime,
        duration: dbSession.dbSessionDuration,
        date: dbSession.dbSessionDate,
        mcq: dbSession.mcq,
        sections: dbSession.sections,
        dbSessionName: dbSession.dbSessionName,
        coding: dbSession.coding,
      };
      res.status(200).send({
        success: true,
        data: durationData
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(500).send({
          success: false,
          message: "Could not find dbSession with id " + req.body.dbSessionId,
        });
      }
      return res.status(400).send({
        success: false,
        message: "Could not find dbSession with id " + req.body.dbSessionId,
      });
    });
};
