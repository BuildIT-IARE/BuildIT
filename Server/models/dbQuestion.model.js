// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var dbQuestionSchema = new Schema({
  questionId: String,
  questionName: String,
  contestId: String,
  questionDescriptionText: String,
  questionInputText: String,
  questionOutputText: String,
  questionExampleInput: String,
  questionExampleOutput: String,
  questionHiddenOutput: Object,
  questionExplanation: String,
  score: Number,
  difficulty: String,
  author: String,
  editorial: String,
  tableName: String,
  tableData: Object,
  CountValue: Number,
});

module.exports = mongoose.model("DbQuestion", dbQuestionSchema);
