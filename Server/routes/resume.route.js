let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const resume = require("../controllers/resume.controller.js");

    app.post("/resume",middleware.checkToken,resume.create);

    app.get("/resumes",middleware.checkTokenAdmin,resume.findAll);

    app.get("/resume/:username",middleware.checkToken,resume.findOne);

    app.delete("/resume/:username",middleware.checkTokenAdmin,resume.delete);

    app.post("/getAllResumes", middleware.checkTokenAdmin, resume.findAll)
}