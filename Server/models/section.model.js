// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var sectionSchema = new Schema({
  contestId: String,
  sectionId: String,
  sectionName: String,
});

module.exports = mongoose.model("Section", sectionSchema);
