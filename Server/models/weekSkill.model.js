// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var weekSkillSchema = new Schema({
	dateId: Date,
	weekId: String,
});

module.exports = mongoose.model("WeekSkill", weekSkillSchema);
