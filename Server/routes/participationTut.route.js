let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const participation = require("../controllers/participationTut.controller.js");

  // Create a new participation
  app.post("/tparticipations", middleware.checkToken, participation.create);

  app.get(
    "/tparticipations/findUserCourses",
    middleware.checkToken,
    participation.findUserCourses
  );
  // Retrieve all participations
  app.post(
    "/tparticipations/all",
    middleware.checkTokenAdmin,
    participation.findCourse
  );

  app.get(
    "/tparticipations",
    middleware.checkTokenAdmin,
    participation.findAll
  );

  app.post(
    "/tparticipations/contentDevProgress/:username",
    middleware.checkTokenAdmin,
    participation.findContentDevSolved
  );

  // Retrieve all participations per contestId in body
  // app.post('/tparticipations/all', middleware.checkToken, participation.findContestPart);

  // Retrieve all participations for user in a contest
  app.get(
    "/tparticipations/:courseId",
    middleware.checkToken,
    participation.findUser
  );
};
