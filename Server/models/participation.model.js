// MONGOOSE SCHEMA

const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var participationSchema = new Schema({
  participationId: String,
  username: String,
  contestId: String,
  participationTime: String,
  submissionResults: Array,
  validTill: String,
  questions: Array
});

var result = new Schema({
  compute: { type: Boolean, default: true },
  totalScore: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  divisionScore: Array,
  divisionCount: Array,
  divisionAttemptCount: Array,
  statistics: Array,
  answerKey: Array
});

var response = new Schema({
  numeral:   [{ mcqId: String, questionNum: Number, selection: Number }],
  reasoning: [{ mcqId: String, questionNum: Number, selection: Number }],
  verbal:    [{ mcqId: String, questionNum: Number, selection: Number }],
  programming: [{ mcqId: String, questionNum: Number, selection: Number }],
});

var mcqParticipationSchema = new Schema({
  participationId: String,
  username: String,
  contestId: String,
  participationTime: String,
  validTill: String,
  questions: Array,
  submissionResults: result,
  responses: response,
});

module.exports = {
  Participation: mongoose.model("Participation", participationSchema),
  McqParticipation: (module.exports = mongoose.model(
    "McqParticipation",
    mcqParticipationSchema
  )),
};
