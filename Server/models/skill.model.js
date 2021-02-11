// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var skillSchema = new Schema({
	weekId: String,
	rank: { type: Number, default: 0 },	
	rollNumber: String,
	hackerRank: String,
	codeChef: String,
	codeforces: String,
	interviewBit: String,
	spoj: String,
	geeksForGeeks: String,
	buildIT: String,
	overallScore: String,
	weeklyPerformance: { type: Number, default: 0 },
	points: { type: Number, default: 0 },
});

module.exports = mongoose.model("Skill", skillSchema);
