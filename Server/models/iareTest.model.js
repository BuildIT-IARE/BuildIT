// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var iareTestSchema = new Schema({
  iareTestId: String,
  iareTestName: String,
});

module.exports = mongoose.model("IareTest", iareTestSchema);
