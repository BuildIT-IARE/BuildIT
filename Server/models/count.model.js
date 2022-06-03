const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var countSchema = new Schema({
    day: Number,
    week: Number,
    total: Number
});

module.exports = mongoose.model("Count", countSchema);
