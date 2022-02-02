// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var iareTestSchema = new Schema({
  testId: String,
  testName: String,
});

module.exports = mongoose.model("IareTest", iareTestSchema);
