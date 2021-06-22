let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const mcqs = require("../controllers/mcq.controller.js");

  // Create a new question
  app.post("/mcq", middleware.checkTokenAdmin, mcqs.create);

  // Create a new question using Excel
  app.post("/mcqsExcel", middleware.checkTokenAdmin, mcqs.createExcel);
  // testing start-----------------------------------------------------------------------------
  // Retrieve all questions
  app.get("/mcqs", middleware.checkTokenAdmin, mcqs.findAll);

  // Retrieve all questions with contestId
  app.get(
    "/mcqs/contests/:contestId",
    middleware.checkTokenAdmin,
    mcqs.findAllContest
  );
  // testing end-------------------------------------------------------------------------------
  // Retrieve a single mcq with contestId
  app.get(
    "/mcqs/:contestId/:section/:questionNum",
    middleware.checkToken,
    mcqs.findOneContest
  );

  // Retrieve first MCQ from first seciton
  app.get("/mcqFirst/:contestId", middleware.checkToken, mcqs.findRecent);

  // Retrieve
  app.get("/mcq/:mcqId", middleware.checkTokenAdmin, mcqs.findOne);

  // Update
  app.post("/mcq/:mcqId", middleware.checkTokenAdmin, mcqs.update);

  // Delete
  app.delete("/mcq/:mcqId", middleware.checkTokenAdmin, mcqs.delete);
};
