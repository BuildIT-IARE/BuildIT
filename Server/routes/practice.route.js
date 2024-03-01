const middleware = require("../util/middleware.js");
const questions = require("../controllers/practice.controller.js")


module.exports = (app) => {

	app.get("/practice", middleware.checkToken, questions.servePracticePage);

	app.get("/practice/:id", middleware.checkToken, questions.sendQuestion);
}