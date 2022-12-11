// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var emailSubmissionSchema = new Schema({
    emailId: String,
    emailQuestionId : String,
    emailSubmissionId : String,
    rollNumber: String,
    emailSource: String,
    facultyComments: String,
    score: Number,
    submissionTime: String,
});

module.exports = mongoose.model("EmailSubmission", emailSubmissionSchema);
