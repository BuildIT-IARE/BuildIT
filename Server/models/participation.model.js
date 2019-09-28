// MONGOOSE SCHEMA

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var participationSchema = new Schema({
    participationId: String,
    userId: String,
    contestId: String,
    participationTime: String,
    submissionResults: Array
});

module.exports = mongoose.model('Participation', participationSchema);
