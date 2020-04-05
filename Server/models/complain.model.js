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
});

module.exports = mongoose.model("Complain", complainSchema);
