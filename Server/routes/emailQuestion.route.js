let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const emailQuestion = require("../controllers/emailQuestion.controller.js");

  // Create a new emailQuestion
  app.post("/emailQuestion", middleware.checkToken, emailQuestion.create);

  // Get all emailQuestions
  app.get("/emailQuestions", middleware.checkToken, emailQuestion.findAll);

  app.get(
    "/emailSessionQuestions/:emailId",
    middleware.checkToken,
    emailQuestion.emailSessionQuestions
  );

  // Get one emailQuestion
  app.get(
    "/emailQuestion/:emailQuestionId",
    middleware.checkToken,
    emailQuestion.findOne
  );

  //Delete emailQuestion
  app.delete(
    "/emailQuestion/:emailQuestionId",
    middleware.checkToken,
    emailQuestion.delete
  );
};
