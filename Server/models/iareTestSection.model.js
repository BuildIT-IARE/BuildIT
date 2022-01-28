// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var iareTestSectionSchema = new Schema({
  iareTestId: String,
  iareTestSectionId: String,
  iareTestSectionName: String,
});

module.exports = mongoose.model("IareTestSection", iareTestSectionSchema);
