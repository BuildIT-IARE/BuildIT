// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var counterSchema = new Schema({
  date: Date,
  count: Number,
});

module.exports = mongoose.model("Counter", counterSchema);
