let middleware = require("../util/middleware.js");
const mcqs = require("../controllers/mcq.controller.js");
const router = require("express").Router();
const mcqLong = require("../controllers/mcqLong.controller.js");





module.exports = (app) => {
    app.post("/mcqLong", middleware.checkTokenAdmin, mcqLong.createContest);

    app.get("/mcqLongContests", middleware.checkToken, mcqLong.getAllContests);
    app.get("/mcqLong/:contestId", middleware.checkTokenAdmin, mcqLong.getContestQuestions);
    app.get("/mcqLong/getSections/:contestId", middleware.checkTokenAdmin, mcqLong.getContest);
    app.post('/isOngoingMcqLong', middleware.checkToken, mcqLong.checkContestActive)
}