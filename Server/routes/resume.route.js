let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const resume = require("../controllers/resume.controller.js");

    app.post("/resumeCreate",resume.create);

    app.get("/allResumes",middleware.checkTokenAdmin,resume.findAll);

    app.get("/MyResume/:username",middleware.checkToken,resume.findOne);
}