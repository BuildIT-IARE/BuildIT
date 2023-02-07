// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var dbSubmissionSchema = new Schema({
    dbSessionId: String,
    questionId: String,
    dbSubmissionId: String,
    rollNumber: String,
    sqlCode: String,
    score: Array,
    submissionTime: String,
    tableName: String,
});

module.exports = mongoose.model("dbSubmission", dbSubmissionSchema);
