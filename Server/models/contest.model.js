// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contestSchema = new Schema({
    contestId: String,
    contestName: String,
    contestDate: String,
    contestDuration: String,
    contestStartTime: String,
    questions: [{
      questionId: String,
      questionName: String
    }]
  }, {strict: false});

module.exports = mongoose.model('Contest', contestSchema);
