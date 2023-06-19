// MONGOOSE SCHEMA

const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var participationTutSchema = new Schema({
  participationId: String,
  username: String,
  courseId: String,
  submissionResults: Array,
  easySolved: Array,
  easySolvedTimeWise : Array,
  mediumSolved: Array,
  mediumSolvedTimeWise : Array,
  hardSolved: Array,
  hardSolvedTimeWise : Array,
  contestSolved: Array,
  contestSolvedTimeWise : Array,
  practiceSolved: Array,
  practiceSolvedTimeWise : Array,
});

module.exports = mongoose.model(
  "ParticipationTutorials",
  participationTutSchema
);
