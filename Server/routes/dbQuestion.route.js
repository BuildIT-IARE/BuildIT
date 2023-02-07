let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const questions = require("../controllers/dbQuestion.controller.js");

    app.post('/questionDBMS',middleware.checkTokenAdmin, questions.create);

    // Retrieve all questions
    app.get("/questionsDBMS", middleware.checkTokenAdmin, questions.findAll);

    // Retrieve a single question with questionId
    app.get("/questionsDBMS/:questionId", middleware.checkToken, questions.findOne);

    // Retrieve all questions with contestId
    app.get(
        "/questionsDBMS/contests/:contestId",
        middleware.checkToken,
        questions.findAllContest
    );

    //Delete multiple questions
    app.post(
        "/deletequestionsDBMS/multiple/:questionIds",
        middleware.checkTokenAdmin,
        questions.deleteMultiple
    );

    // Update a question with questionId
    app.post(
        "/questionsDBMS/:questionId",
        middleware.checkToken,
        questions.update
    );

    // Delete a question with questionId
    app.delete(
        "/questionsDBMS/:questionId",
        middleware.checkTokenAdmin,
        questions.delete
    );

    app.get("/testSQL",questions.test);
    
};