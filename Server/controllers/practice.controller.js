const Question = require("../models/question.model.js");
const Submission = require("./submission.controller.js")

const regex = /^PRACTICE____/;

const servePracticePage = async (req, res) => {
    try {
        // Find questions matching the specified pattern
        const questions = await Question.find({ questionId: { "$regex": "PRACTICE" } });

        // Iterate over each question
        // for (const question of questions) {
        //     // Check if the user has submitted an answer for this question
        //     const userSubmission = await Submission.findUser(req.cookies.username, question.questionId);

        //     // Set the status of the question based on user submission
        //     question.status = userSubmission ? true : false;
        // }

        // Send the modified questions as the response
        res.send(questions);
    } catch (err) {
        // Handle errors
        res.status(500).send('Something went wrong: ' + err);
    }
}

const sendQuestion = async (req, res) => {
    console.log('aaa')
    try {
        const data = await Question.findOne({ questionId: req.params.id });
        console.log('aaa' + data)
        res.send(data)
    }
    catch (err) {
        res.send('something went wrong' + err);
    }
}

module.exports = { servePracticePage, sendQuestion }