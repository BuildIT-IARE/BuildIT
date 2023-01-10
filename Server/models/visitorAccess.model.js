const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var visitorAccessSchema = new Schema({
  name: String,
  phoneNumber: String,
  purpose: String,
  date: Date,
  personId: String,
  allocatedId: String,
  status: String,
  countValue: Number,
  visitorAllocatedId: Array,
  photo: String,
});

module.exports = mongoose.model("Visitor", visitorAccessSchema);
