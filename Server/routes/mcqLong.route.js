let middleware = require("../util/middleware.js");
const mcqs = require("../controllers/mcq.controller.js");
const router = require("express").Router();
const mcqLong = require("../controllers/mcqLong.controller.js");





module.exports = (app) => {
    app.get("/fuckoff", (req, res) => {
        res.send("Hello World");
    })
    app.post("/mcqLong", middleware.checkTokenAdmin, mcqLong.createContest);

    app.get("/mcqLongContests", middleware.checkTokenAdmin, mcqLong.getAllContests);
    app.get("/mcqLong/:contestId", middleware.checkTokenAdmin, mcqLong.getContestQuestions);
    app.get("/mcqLong/getSections/:contestId", middleware.checkTokenAdmin, mcqLong.getContest);
}