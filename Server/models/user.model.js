// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    contests: [{
      contestId: String,
      submissions: [{submissionId: String}],
      results: [{status: String}]
    }],
    admin: Boolean
});

module.exports = mongoose.model('User', userSchema);
