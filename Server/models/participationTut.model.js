// MONGOOSE SCHEMA

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var participationTutSchema = new Schema({
    participationId: String,
    username: String,
    courseId: String,
    participationTime: String,
    submissionResults: Array
});

module.exports = mongoose.model('ParticipationTutorials', participationTutSchema);
