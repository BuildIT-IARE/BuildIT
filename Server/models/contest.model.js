// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contestSchema = new Schema({
    contestId: String,
    contestName: String,
    contestDate: String,
    contestDuration: Number,
    contestStartTime: String,
    questions: [{
      questionId: String,
      questionName: String
    }]
  });

module.exports = mongoose.model('Contest', contestSchema);
