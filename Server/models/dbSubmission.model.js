// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var dbSubmissionSchema = new Schema({
    dbSessionId: String,
    questionId: String,
    rollNumber: String,
    sqlCode: String,    
    score: String,
    submissionTime: String,
    tableName: String,
    color : String,
});

module.exports = mongoose.model("dbSubmission", dbSubmissionSchema);
