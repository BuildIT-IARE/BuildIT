// MONGOOSE SCHEMA

const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var participationSchema = new Schema({
  participationId: String,
  username: String,
  branch: String,
  contestId: String,
  participationTime: String,
  submissionResults: Array,
  validTill: String,
  questions: Array,
  endContest: {
    type: Number,
    default: 0,
  },
});

var result = new Schema({
  compute: { type: Boolean, default: true },
  totalScore: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  divisionScore: Array,
  divisionCount: Array,
  divisionAttemptCount: Array,
  statistics: Array,
  answerKey: Array,
});

var response = new Schema({
  section: [
    {
      name: String,
      responses: [{ mcqId: String, questionNum: Number, selection: Number }],
    },
  ],
});

var mcqParticipationSchema = new Schema({
  participationId: String,
  username: String,
  contestId: String,
  contestName: String,
  participationTime: String,
  validTill: String,
  questions: Array,
  submissionResults: Array,
  totalSubmissionResultsScore: Number,
  mcqResults: result,
  responses: [
    {
      section: String,
      responses: [{ mcqId: String, questionNum: Number, selection: Number }],
    },
  ],
  sections: [String],
});

module.exports = {
  Participation: mongoose.model("Participation", participationSchema),
  McqParticipation: (module.exports = mongoose.model(
    "McqParticipation",
    mcqParticipationSchema
  )),
};
