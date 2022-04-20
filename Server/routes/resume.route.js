let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const resume = require("../controllers/resume.controller.js");

    app.post("/resumeCreate",resume.create);

    // app.get("/allresumes",middleware.checkToken,resume.findAll);

    app.get("/MyResume/:username",middleware.checkToken,resume.findOne);
}