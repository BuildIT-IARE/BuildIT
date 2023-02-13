const Question = require("../models/dbQuestion.model.js");
const sqlCon = require("./sqlDBConnector.js");

exports.create = (req, res) => {
  Question.find()
    .then((questions) => {
      var currQuestions = questions[0].CountValue + 1;
      req.body.questionId = "IARE_DB" + currQuestions.toString();
      Question.findOneAndUpdate(
        { questionId: questions[0].questionId },
        { $set: { CountValue: currQuestions } }
      )
        .then()
        .catch((err) => {
          res.status(500).send({
            success: false,
            message:
              err.message || "Some error occurred while retrieving questions.",
          });
        });
      // Create a Question
      sql = "SELECT * FROM "+req.body.tableName;
      sqlCon.query(sql, function (err, result) {
        if (err){
          return res.status(500).send({
            success: false,
            message:
              err.message || "Some error occurred while retrieving table for the question." + req.body.questionId,
          });
        }
        sqlCon.query(req.body.questionSolution,function(err1,result1){
          if (err1){
            return res.status(500).send({
              success: false,
              message:
                err1.message || "Some error occurred while retrieving solution table for the question." + req.body.questionId,
              });
            }
            const question = new Question({
              questionId: req.body.questionId,
              questionName: req.body.questionName,
              contestId: req.body.contestId,
              questionDescriptionText: req.body.questionDescriptionText,
              questionInputText: req.body.questionInputText,
              questionOutputText: req.body.questionOutputText,
              questionExampleInput: req.body.questionExampleInput,
              questionExampleOutput: req.body.questionExampleOutput,
              questionHiddenOutput: result1,
              questionExplanation: req.body.questionExplanation,
              score: req.body.score,
              difficulty: req.body.difficulty,
              tableName: req.body.tableName,
              tableData: result,
              author: req.body.author,
              editorial: req.body.editorial,
            });
            // Save Question in the database
            question
              .save()
              .then((data) => {
                res.status(200).send({
                  success: true,
                  data : data,
                });
              })
              .catch((err) => {
                res.status(500).send({
                  success: false,
                  message:
                    err.message || "Some error occurred while creating the Question.",
                });
              });
        })
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
      res.send({
        success: true,
        data: question,
      });
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
      res.send({
        success: true,
        data: questions,
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

// Retrieve all questions from a contest
exports.findAllContest = (req, res) => {
  Question.find({ contestId: req.params.contestId })
    .then((questions) => {
      if (!questions) {
        return res.status(404).send({
          success: false,
          message: "Questions not found with contestId " + req.params.contestId,
        });
      }
      res.send({
        success: true,
        data: questions,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Questions not found with contestId " + req.params.contestId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Questions not found with contestId " + req.params.contestId,
      });
    });
};

// Update a question identified by the questionId in the request
exports.update = (req, res) => {
  if (!req.body.questionId) {
    return res.status(400).send({
      success: false,
      message: "content can not be empty",
    });
  }
  Question.findOneAndUpdate(
    { questionId: req.params.questionId },
    {
      $set: {
        questionId: req.body.questionId,
        questionName: req.body.questionName,
        contestId: req.body.contestId,
        questionDescriptionText: req.body.questionDescriptionText,
        questionInputText: req.body.questionInputText,
        questionOutputText: req.body.questionOutputText,
        questionExampleInput: req.body.questionExampleInput,
        questionExampleOutput: req.body.questionExampleOutput,
        questionSolution: req.body.questionSolution,
        questionExplanation: req.body.questionExplanation,
        author: req.body.author,
        score: req.body.score,
        difficulty: req.body.difficulty,
        editorial: req.body.editorial,
        tableName: req.body.tableName,
      },
    },
    { new: true }
  )
    .then((question) => {
      if (!question) {
        return res.status(404).send({
          success: false,
          message: "Question not found with id " + req.params.questionId,
        });
      }
      res.send("Updated Successfully, Go Back");
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
        message: "Error updating Question with id " + req.params.questionId,
      });
    });
};

exports.delete = (req, res) => {
  Question.findOneAndRemove({ questionId: req.params.questionId })
    .then((question) => {
      if (!question) {
        return res.status(404).send({
          success: false,
          message: "question not found with id " + req.params.questionId,
        });
      }
      res.send({ message: "question deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "question not found with id " + req.params.questionId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not delete question with id " + req.params.questionId,
      });
    });
};

// Delete questions with the specified questionIds in the request
exports.deleteMultiple = (req, res) => {
  questionIds = req.params.questionIds
    .split(",")
    .filter((item) => !item.includes("-"))
    .map((item) => item.trim());
  Question.deleteMany({ questionId: { $in: questionIds } })
    .then((question) => {
      if (!question) {
        return res.status(404).send({
          success: false,
          message: "question not found with id " + req.params.questionId,
        });
      }
      res.send({ message: "questions deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "question not found with id " + req.params.questionId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not delete question with id " + req.params.questionId,
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
        });
      }
      question = question[0];
      testcases = {
        contestId: question.contestId,
        HO1: question.questionSolution,
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
        });
      }
      return res.status(400).send({
        success: false,
        message: "Error retrieving " + req.params.questionId,
      });
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
