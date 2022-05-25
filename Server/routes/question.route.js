let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const questions = require("../controllers/question.controller.js");

  // Create a new question
  app.post("/questions", middleware.checkTokenAdmin, questions.create);

  // Create a new question
  app.post(
    "/questionsExcel",
    middleware.checkTokenAdmin,
    questions.createExcel
  );

  // Create a new question
  app.post(
    "/questionsExcel/:contestId",
    middleware.checkTokenAdmin,
    questions.createSet
  );

  // Create a new set
  app.post(
    "/questionIds/:contestId",
    middleware.checkTokenAdmin,
    questions.addSetGivenQIdArray
  );

  // Create a new question for Tutorials
  app.post(
    "/questiontutorials",
    middleware.checkTokenAdmin,
    questions.createTutorials
  );
 

  // Create a new question for Tutorials
  app.post(
    "/questiontutorialsExcel",
    middleware.checkTokenAdmin,
    questions.createTutorialsExcel
  );

  // Retrieve all questions
  app.get("/questions", middleware.checkTokenAdmin, questions.findAll);

  // Retrieve a single questionName with questionId Public
  app.get("/questions/name/:questionId", questions.getQuestionName);

  // Retrieve a single question with questionId
  app.get("/questions/:questionId", middleware.checkToken, questions.findOne);

  // Retrieve all questions with contestId
  app.get(
    "/questions/contests/:contestId",
    middleware.checkToken,
    questions.findAllContest
  );

  // Retrieve all questions with courseId
  app.get(
    "/questions/courses/:courseId",
    middleware.checkToken,
    questions.findAllCourse
  );

  // Retrieve all questions with courseId and diff
  app.get(
    "/questions/courses/:courseId/:difficulty",
    middleware.checkToken,
    questions.findAllCourseDifficulty
  );

  // Retrieve all questions with courseId and diff/subdiff
  app.get(
    "/questions/courses/:courseId/:difficulty/:conceptLevel",
    middleware.checkToken,
    questions.findAllCourseConceptWise
  );

  app.get(
    "/questions/practice/:courseId/:title/:name",
    middleware.checkToken,
    questions.findAllCourseTopicWise
  );
  
  //Delete multiple questions
  app.post(
    "/deletequestions/multiple/:questionIds",
    middleware.checkTokenAdmin,
    questions.deleteMultiple
  );

  // Update a question with questionId
  app.post(
    "/questions/:questionId",
    middleware.checkToken,
    questions.update
  );

  // Delete a question with questionId
  app.delete(
    "/questions/:questionId",
    middleware.checkTokenAdmin,
    questions.delete
  );

  // Create a new question
  app.post(
    "/questions/mergeCourse",
    middleware.checkTokenAdmin,
    questions.merge
  );
};
