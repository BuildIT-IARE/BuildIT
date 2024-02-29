const Question = require("../models/question.model.js");

const regex = /^PRACTICE____/;

const servePracticePage = async (req, res) => {

	try {
		const data = await Question.find(
			{ questionId: {"$regex": "PRACTICE"} }
			);
		res.send(data)

	}

	catch (err) {
		res.send('something went wrong ' + err);
	}
	
}

module.exports = { servePracticePage }