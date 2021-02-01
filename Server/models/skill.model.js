// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var skillSchema = new Schema({
	weekId: String,
	rank: { type: Number, default: 0 },	
	rollNumber: String,
	name: String,
	hackerRank: { type: Number, default: 0 },
	codeChef: { type: Number, default: 0 },
	codeforces: { type: Number, default: 0 },
	interviewBit: { type: Number, default: 0 },
	spoj: { type: Number, default: 0 },
	geeksForGeeks: { type: Number, default: 0 },
	buildIT: { type: Number, default: 0 },
	overallScore: { type: Number, default: 0 },
	weeklyPerformance: { type: Number, default: 0 },
});

module.exports = mongoose.model("Skill", skillSchema);
