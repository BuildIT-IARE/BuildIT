// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var submissionSchema = new Schema({
  questionId: String,
  username: String,
  languageId: String,
  sourceCode: String,
  score: Number,
  result: Array,
  submissionToken: Array,
  submissionTime: String,
  color: String,
  ipAddress: String,
});

module.exports = mongoose.model("Submission", submissionSchema);
