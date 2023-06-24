// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var complainSchema = new Schema({
  complainId: String,
  complainSubject: String,
  username: String,
  complainDesc: String,
  questionId: String,
  questionName: String,
  resolutionDate: { type: Date },
  resolutionStatus: { type: Boolean, default: false },
  resolutionRemarks: String,
});

module.exports = mongoose.model("Complain", complainSchema);
