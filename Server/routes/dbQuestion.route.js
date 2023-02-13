let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const questions = require("../controllers/dbQuestion.controller.js");

    app.post('/dbQuestion',middleware.checkTokenAdmin, questions.create);

    // Retrieve all questions
    app.get("/dbQuestions", middleware.checkTokenAdmin, questions.findAll);

    // Retrieve a single question with questionId
    app.get("/dbQuestions/:questionId", middleware.checkToken, questions.findOne);

    // Retrieve all questions with contestId
    app.get(
        "/dbQuestions/contests/:contestId",
        middleware.checkToken,
        questions.findAllContest
    );

    //Delete multiple questions
    app.post(
        "/deletedbQuestions/multiple/:questionIds",
        middleware.checkTokenAdmin,
        questions.deleteMultiple
    );

    // Update a question with questionId
    app.post(
        "/dbQuestions/:questionId",
        middleware.checkToken,
        questions.update
    );

    // Delete a question with questionId
    app.delete(
        "/dbQuestions/:questionId",
        middleware.checkTokenAdmin,
        questions.delete
    );

    app.get("/testSQL",questions.test);
    
};