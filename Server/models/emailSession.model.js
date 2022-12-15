// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var emailSchema = new Schema({
    emailId: String,
    emailName: String,
    emailDate: String,
    emailFaculty : String,
    facultyId : String,
    emailStartDay : String,
    emailEndDay : String,
    emailStartTime: String,
    emailEndTime: String,
    emailPassword: String,
});

module.exports = mongoose.model("email", emailSchema);
