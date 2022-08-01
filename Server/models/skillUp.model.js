// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var skillUpSchema = new Schema({
	// weekId: String,
	rollNumber: String,
	leetCodeId: String,
	leetCodeScore: { type: Number, default: 0 },
	hackerRankId: String,
	hackerRankScore: { type: Number, default: 0 },
	codeChefId: String,
	codeChefScore: { type: Number, default: 0 },
	codeForcesId: String,
	codeForcesScore: { type: Number, default: 0 },
	interviewBitId: String,
	interviewBitScore: { type: Number, default: 0 },
	spojId: String,
	spojScore: { type: Number, default: 0 },
	geeksForGeeksId: String,
	geeksForGeeksScore: { type: Number, default: 0 },
	buildIT: { type: Number, default: 0 },
	overallScore: { type: Number, default: 0 }
});

module.exports = mongoose.model("SkillUp", skillUpSchema);