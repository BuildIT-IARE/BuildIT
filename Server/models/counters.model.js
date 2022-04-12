// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var counterSchema = new Schema({
    prevDay: Number,
    weeklyCount: Number
});

module.exports = mongoose.model("Counter", counterSchema);
