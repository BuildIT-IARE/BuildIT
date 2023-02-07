// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var questionSQLSchema = new Schema({
    questionId: String,
    questionName: String,
    contestId: String,
    questionDescriptionText: String,
    questionInputText: String,
    questionOutputText: String,
    questionExampleInput1: String,
    questionExampleOutput1: String,
    questionHiddenInput1: String,
    questionHiddenOutput1: String,
    questionExplanation: String,
    author: String,
    editorial: String,
    tableName: String,
    CountValue:Number,
});

module.exports = mongoose.model("QuestionSQL", questionSQLSchema);