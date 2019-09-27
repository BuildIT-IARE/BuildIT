// MONGOOSE SCHEMA

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var participationSchema = new Schema({
    userId: String,
    contestId: String,
    score: String,
    acceptedSubmissions: String,
    participationTime: String
});

module.exports = mongoose.model('Participation', participationSchema);
