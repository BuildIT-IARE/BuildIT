// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var mcqSchema = new Schema({
  mcqId: String,
  contestId: String,
	mcqDescriptionText: String,
  option1: String,
	option2: String,
	option3: String,
	option4: String,
	// 1, 2, 3, 4
	answer: { type: Number, default: 0 },
	// 1: Numerical Ability, 2: Reasoning Ability, 3: Verbal Ability, 4: Programming Logic
	section: { type: Number, default: 0 },
	// description image
	photo: { data: Buffer, contentType: String }
});

module.exports = mongoose.model("Mcq", mcqSchema);
