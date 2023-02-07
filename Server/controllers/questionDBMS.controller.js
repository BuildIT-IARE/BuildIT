const Question = require('../models/questionDBMS.model.js');
const sqlCon = require("../controllers/sqlDB.js");


exports.create = (req, res) => {
    Question.find()
    .then((questions) => {
        var currQuestions = questions[0].CountValue + 1;
        req.body.questionId = "IARE_DB" + currQuestions.toString();
        Question.findOneAndUpdate({questionId:questions[0].questionId},{$set:{CountValue:currQuestions}})
        .then()
        .catch((err) => {
            res.status(500).send({
                success: false,
                message:
                    err.message || "Some error occurred while retrieving questions.",
            });
        })
        // Create a Question
        const question = new Question({
            questionId: req.body.questionId,
            questionName: req.body.questionName,
            contestId: req.body.contestId,
            questionDescriptionText: req.body.questionDescriptionText,
            questionInputText: req.body.questionInputText,
            questionOutputText: req.body.questionOutputText,
            questionExampleInput1: req.body.questionExampleInput1,
            questionExampleOutput1: req.body.questionExampleOutput1,
            questionHiddenInput1: req.body.questionHiddenInput1,
            questionHiddenOutput1: req.body.questionHiddenOutput1,
            questionExplanation: req.body.questionExplanation,
            tableName: req.body.tableName,
            author: req.body.author,
            editorial: req.body.editorial,
        });
        // Save Question in the database
        question
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                    success: false,
                    message:
                        err.message || "Some error occurred while creating the Question.",
                });
            });
        })
    .catch((err) => {
        res.status(500).send({
            success: false,
            message:
                err.message || "Some error occurred while retrieving questions.",
        });
    });
};

exports.findOne = (req, res) => {
    Question.find({ questionId: req.params.questionId })
    .then((question) => {
        if (!question) {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId,
            });
        }
        res.send(question);
    })
    .catch((err) => {
        if (err.kind === "ObjectId") {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId,
            });
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving question with id " + req.params.questionId,
        });
    });
};

// Retrieve and return all questions from the database.
exports.findAll = (req, res) => {
    Question.find()
    .then((questions) => {
        res.send(questions);
    })
    .catch((err) => {
        res.status(500).send({
            success: false,
            message:
            err.message || "Some error occurred while retrieving questions.",
        });
    });
};

// Find testcases with questionId
exports.getTestCases = (req, callback) => {
    Question.find({ questionId: req.body.questionId })
    .then((question) => {
        if (!question) {
            return res.status(500).send({
                success: false,
                message: "Question not found with id " + req.params.questionId,
            })
        }
        question = question[0];
        testcases = {
            contestId: question.contestId,
            HI1: question.questionHiddenInput1,
            HO1: question.questionHiddenOutput1,
        };
        return res.status(200).send({
            success: true,
            testcases,
        });
    })
    .catch((err) => {
        if (err.kind === "ObjectId") {
            return res.status(500).send({
                success: false,
                message: "Question not found with id " + req.params.questionId,
            })
        }
        return res.status(400).send({
            success: false,
            message: "Error retrieving " + req.params.questionId,
        })
    });
};

exports.test = (req, res) => {
    sql = "SELECT * FROM students";
    sqlCon.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`Query executed: ${sql}`);
        res.status(200).send(result);
    });
};

