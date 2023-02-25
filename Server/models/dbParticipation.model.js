// MONGOOSE SCHEMA

const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var dbParticipationSchema = new Schema({
    participationId: String,
    username: String,
    branch: String,
    dbSessionId: String,
    participationTime: String,
    submissionResults: Array,
    validTill: String,
    questions: Array,
    endContest: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("DBParticipation", dbParticipationSchema);