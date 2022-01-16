const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var eventSchema = new Schema({
  EventName: String,
  Eventposter: String,
  Eventday: [Number],
  Eventmonth: [String],
  Eventyear: [Number],
  Starttime: String,
  Endtime: String,
  Duration: String,
  Rating: String,
  Contestlink: String,
  DIV1: String,
  DIV2: String,
  DIV3: String,
});

module.exports = mongoose.model("Event", eventSchema);
