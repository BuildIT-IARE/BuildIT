let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const emailQuestion = require('../controllers/emailQuestion.controller.js');

    // Create a new emailQuestion
    app.post("/emailQuestion", middleware.checkTokenAdmin, emailQuestion.create);

    // Get all emailQuestions
    app.get("/emailQuestions",middleware.checkToken,emailQuestion.findAll);

    // Get one emailQuestion
    app.get("/emailQuestion/:emailId",middleware.checkToken,emailQuestion.findOne);

    //Delete emailQuestion
    app.delete("/emailQuestion/:emailId",middleware.checkToken,emailQuestion.delete);
}