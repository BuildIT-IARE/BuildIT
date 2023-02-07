// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var dbquestionSchema = new Schema({
  questionId: String,
  questionName: String,
  contestId: String,
  questionDescriptionText: String,
  questionExampleInput: String,
  questionExampleOutput: String,
  questionHiddenOutput: String,
  questionExplanation: String,
  author: String,
  CountValue: Number,
  tableName: String,
});

module.exports = mongoose.model("dbQuestion", dbquestionSchema);
