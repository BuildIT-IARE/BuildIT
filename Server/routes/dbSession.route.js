let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const dbSession = require("../controllers/dbSession.controller.js");

    // Create a new dbSession
    app.post("/dbSession", middleware.checkToken, dbSession.create);

    // Retrieve all dbSession (testing)
    app.get("/dbSessions", middleware.checkToken, dbSession.findAllSession);

    // Retrieve a single dbSession with dbSessionId
    app.get("/dbSession/:dbSessionId", middleware.checkToken, dbSession.findOne);

    // Update a dbSession with dbSessionId
    app.post("/dbSession/:dbSessionId", middleware.checkToken, dbSession.update);

    // Delete a dbSession with dbSessionId
    app.delete("/dbSession/:dbSessionId",middleware.checkToken,dbSession.delete);
}