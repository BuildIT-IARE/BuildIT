let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const emailSession = require("../controllers/emailSession.controller.js");

    // Create a new emailSession
    app.post("/emailSession", middleware.checkToken, emailSession.create);

    // Retrieve all emailSession (testing)
    app.get("/emailSessions", middleware.checkToken, emailSession.findAllSession);
    
    // Retrieve all emailSession of a Faculty (Admin Side)
    app.get("/emailSessions/:facultyId", middleware.checkToken, emailSession.findAll);

    // Retrieve a single emailSession with emailId
    app.get("/emailSession/:emailId", middleware.checkToken, emailSession.findOne);

    // Update a emailSession with emailId
    app.post("/emailSession/:emailId", middleware.checkToken, emailSession.update);

    // Delete a emailSession with emailId
    app.delete("/emailSession/:emailId",middleware.checkToken,emailSession.delete);

    // For Checking emailSession Password
    app.post("/checkEmailSessionPassword",middleware.checkToken,emailSession.checkEmailPassword);
}