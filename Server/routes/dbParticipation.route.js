let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const dbParticipation = require("../controllers/dbParticipation.controller.js");

    // Create a new participation
    app.post("/dbParticipations", middleware.checkToken, dbParticipation.create);

    // Retrieve all participations
    app.get("/dbParticipations", middleware.checkTokenAdmin, dbParticipation.findAll);

    // Retrieve all participations per contestId in body
    app.post(
        "/dbParticipations/all",
        middleware.checkToken,
        dbParticipation.findContestPart
    );

    // Retrieve all participations for users in a contest
    app.get(
        "/dbParticipations/:contestId",
        middleware.checkToken,
        dbParticipation.findUser
    );
}