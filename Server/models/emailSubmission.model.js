// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var emailSubmissionSchema = new Schema({
  emailId: String,
  emailQuestionId: String,
  emailSubmissionId: String,
  rollNumber: String,
  emailSource: String,
  emailSubject: String,
  facultyComments: String,
  score: Array,
  submissionTime: String,
  evaluated: Boolean,
  emailScore: Number,
  emailName: String,
});

module.exports = mongoose.model("EmailSubmission", emailSubmissionSchema);
