// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var submissionSchema = new Schema({
    questionId: String,
    username: String,
    languageId: String,
    sourceCode: String,
    score: String,
    result: String,
    submissionToken: String,
    submissionTime: String
});

module.exports = mongoose.model('Submission', submissionSchema);
