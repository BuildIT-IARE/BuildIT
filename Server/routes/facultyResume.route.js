let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const facultyResume = require("../controllers/facultyResume.controller.js");

    app.post("/facultyResume",middleware.checkToken,facultyResume.create);

    app.get("/facultyResume/:username",middleware.checkToken,facultyResume.findOne);

}