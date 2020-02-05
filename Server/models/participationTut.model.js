// MONGOOSE SCHEMA

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var participationTutSchema = new Schema({
    participationId: String,
    username: String,
    courseId: String,
    submissionResults: Array,
    easySolved: Array,
    mediumSolved: Array,
    hardSolved: Array
});

module.exports = mongoose.model('ParticipationTutorials', participationTutSchema);
