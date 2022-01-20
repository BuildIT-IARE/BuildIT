const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var eventSchema = new Schema({
  eventName: String,
  eventPoster: String,
  eventDay: [Number],
  eventMonth: [String],
  eventYear: [Number],
  startTime: String,
  endTime: String,
  duration: String,
  rating: String,
  contestLink: String,
  div1: String,
  div2: String,
  div3: String,
});

module.exports = mongoose.model("Event", eventSchema);
