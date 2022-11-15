// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var discussionSchema = new Schema({
    questionId : String,
    discussionId : String,
    message : String,
    likes : Array,
    rollNumber : String
},{
    timestamps: true
})

module.exports = mongoose.model("Discussion", discussionSchema);
