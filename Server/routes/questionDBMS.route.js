let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const questions = require("../controllers/questionDBMS.controller.js");

    app.get("/test",questions.test);
    
};