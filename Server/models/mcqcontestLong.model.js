// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var contestSchema = new Schema({
  contestId: String,
  contestName: String,
  contestStartTime: String,
  contestEndTime:String,
  contestStartDate: String,
  contestEndDate: String,
  multiset: { type: Boolean, default: false },
  sets: Array,
  mcq: { type: Boolean, default: false },
  usernames: [String],
  sections: [String],
  coding: { type: Boolean, default: false },
  contestPassword: String,
});

module.exports = mongoose.model("contestLong", contestSchema);

