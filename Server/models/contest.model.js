// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contestSchema = new Schema({
    contestId: String,
    contestName: String,
    contestDate: String,
    contestDuration: String,
    contestStartTime: String,
    published: String,
  });

module.exports = mongoose.model('Contest', contestSchema);
