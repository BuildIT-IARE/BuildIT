const Question = require("../models/question.model.js");
const Submission = require("../models/submission.model.js")


const servePracticePage = async (req, res) => {
    try {
        const regExpPattern = new RegExp(req.body.username, "i");
        // Find questions matching the specified pattern
        const questions = await Question.find({ questionId: { "$regex": "PRACTICE" } });

        const userSubmissions = await Submission.find({
            "questionId": { "$regex": "PRACTICE" },
            "username": { "$regex": regExpPattern },
        });


        console.log(userSubmissions)

        let userSubmissionsMap = {}
        
        userSubmissions.forEach((submission) => {
            if (!userSubmissionsMap.hasOwnProperty(submission.questionId)) {
                userSubmissionsMap[submission.questionId] = submission.score;
            } else {
                userSubmissionsMap[submission.questionId] = Math.max(userSubmissionsMap[submission.questionId], submission.score);
            }
        });



        const payload = []

        questions.forEach((question) => {
            let statusCheck = '';
            if (userSubmissionsMap.hasOwnProperty(question.questionId)) {
                const score = userSubmissionsMap[question.questionId];
                if (score == 100) {
                    statusCheck = 'Solved'
                }
                else if (score > 0) {
                    statusCheck = 'Partially Solved'
                }
                else {
                    statusCheck = 'Unsolved'
                }
            }
            else {
                statusCheck = 'Unsolved'
            }

            const payloadInstance = {
                questionId: question.questionId,
                questionName: question.questionName,
                difficulty: question.difficulty,
                estimateTime: question.estimateTime,
                status: statusCheck,
                tags: question.tags,
            }

            payload.push(payloadInstance)
        })
        res.send(payload);
    } catch (err) {
        // Handle errors
        res.status(500).send('Something went wrong: ' + err);
    }
}



const sendQuestion = async (req, res) => {
    try {
        const data = await Question.findOne({ questionId: req.params.id });
        res.send(data)
    }
    catch (err) {
        res.send('something went wrong' + err);
    }
}

module.exports = { servePracticePage, sendQuestion }