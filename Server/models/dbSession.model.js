// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var dbSessionSchema = new Schema({
    dbSessionId: String,
    dbSessionName: String,
    dbSessionStartDay : String,
    dbSessionEndDay : String,
    dbSessionStartTime: String,
    dbSessionEndTime: String,
    dbDuration: String,
    dbSessionPassword: String,
});

module.exports = mongoose.model("DbSession", dbSessionSchema);
