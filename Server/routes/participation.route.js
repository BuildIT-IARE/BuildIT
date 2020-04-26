let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const participation = require("../controllers/participation.controller.js");

  // Create a new participation
  app.post("/participations", middleware.checkToken, participation.create);

  // Retrieve all participations
  app.get("/participations", middleware.checkTokenAdmin, participation.findAll);

  // Retrieve all participations per contestId in body
  app.post(
    "/participations/all",
    middleware.checkToken,
    participation.findContestPart
  );

  // Retrieve all participations for users in a contest
  app.get(
    "/participations/:contestId",
    middleware.checkToken,
    participation.findUser
  );
};
