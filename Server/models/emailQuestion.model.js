// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var emailQuestionSchema = new Schema({
    emailId: String,
    emailQuestionId: String,
    emailQuestionName: String,
    emailTopic: String,
    emailScore : Number,
    emailGuidelines : String
});

module.exports = mongoose.model("EmailQuestion", emailQuestionSchema);
