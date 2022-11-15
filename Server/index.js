const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const request = require("request");
const moment = require("moment-timezone");
const upload = require("express-fileupload");
var path = require("path");
const archiver = require("archiver");
const fs = require("fs");
const requestIp = require("request-ip");
const dotenv = require("dotenv");
const schedule = require("node-schedule");
const Count = require("./models/count.model.js");
const SkillUp = require("./controllers/skillUp.controller.js");
dotenv.config({ path: "../Server/util/config.env" });

let middleware = require("./util/middleware.js");

const User = require("./models/user.model");
const Participation = require("./models/participation.model").Participation;
const McqParticipation =
  require("./models/participation.model").McqParticipation;
const ParticipationTut = require("./models/participationTut.model");

// API Address
const localServer = process.env.localServer;
const port = process.env.PORT || 5000;
let apiAddress = process.env.apiAddress;
let timeOut = 3000;

if (localServer) {
  apiAddress = process.env.localAPI;
  timeOut = 0;
}

console.log("Using API from URL: ", apiAddress);

// INIT
const app = express();
app.options("*", cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(upload());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../web/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../web/build", "index.html"));
  });
}

// CODE STARTS HERE

mongoose.Promise = global.Promise;
moment.suppressDeprecationWarnings = true;

dbConfig = {
  url: process.env.dbURL,
};
// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    //to remove deprication message
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// Imports
const users = require("./controllers/user.controller.js");
const submissions = require("./controllers/submission.controller.js");
const questions = require("./controllers/question.controller.js");
const participations = require("./controllers/participation.controller.js");
const contests = require("./controllers/contest.controller.js");
const complains = require("./controllers/complain.controller.js");
const participationsTut = require("./controllers/participationTut.controller.js");
const courses = require("./controllers/course.controller.js");
const skills = require("./controllers/skill.controller.js");
const mcqs = require("./controllers/mcq.controller.js");
const codechefEvents = require("../Server/controllers/codechefEvents.controller.js");
const counters = require("../Server/controllers/counters.controller.js");
const resume = require("../Server/controllers/resume.controller.js");
const facultyResume = require("../Server/controllers/facultyResume.controller.js");
const skillUp = require("../Server/controllers/skillUp.controller.js");
const discussion = require("../Server/controllers/discussion.controller.js");

// Require contest routes
require("./routes/contest.route.js")(app);
// Require user routes
require("./routes/user.route.js")(app);
// Require question routes
require("./routes/question.route.js")(app);
// Require submission routes
require("./routes/submission.route.js")(app);
// Require participation routes
require("./routes/participation.route.js")(app);

// Require participation routes
require("./routes/participationTut.route.js")(app);
// Require course routes
require("./routes/course.route.js")(app);
// Require complain routes
require("./routes/complain.route.js")(app);
// Require skill routes
require("./routes/skill.route.js")(app);
// Require mcq routes
require("./routes/mcq.route.js")(app);
// Require events routes
require("./routes/codechefEvents.route.js")(app);
// Require counters routes
require("./routes/counters.route.js")(app);
// Require resume routes
require("./routes/resume.route.js")(app);
// Require facultyResume routes
require("./routes/facultyResume.route.js")(app);
// Require skillUp routes
require("./routes/skillUp.route.js")(app);
// Require discussion routes
require("./routes/discussion.route.js")(app);

// Examples
app.get("/testGet", async (req, res) => {
  console.log("Tested Get");
  res.json({ status: "working" });
});

app.post("/testPost", async (req, res) => {
  console.log("request body");
  console.log(req.body);
  res.json(req.body);
});

// Main Routes
app.post("/isOngoing", middleware.checkToken, async (req, res) => {
  contests.getDuration(req, (err, duration) => {
    if (err) {
      res.status(404).send({ message: err });
    }

    let date = new Date();
    let today = date.toLocaleDateString();
    if (today.length === 9) {
      today = "0" + today;
    }

    // let day = today.slice(0, 2);

    // let month = today.slice(3, 5);

    // let year = today.slice(6, 10);

    let day = date.getDate();
    if (day < 10) {
      day = "0" + String(day);
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + String(month);
    }
    let year = date.getFullYear();

    if (!localServer) {
      today = `${year}-${day}-${month}`;
    } else {
      today = `${year}-${month}-${day}`;
    }
    let minutes = date.getMinutes();
    let hours = date.getHours();
    minutes = minutes + 30;
    hours = hours + 5;
    if (hours < 10) {
      hours = "0" + String(hours);
    }

    if (minutes < 10) {
      minutes = "0" + String(minutes);
    }

    let currentTime = `${hours}${minutes}`;
    currentTime = eval(currentTime);
    currentTime = moment().tz("Asia/Kolkata").format("HHmm");
    // console.log(currentTime);
    if (
      duration.date.toString() === today &&
      duration.startTime.toString() < currentTime &&
      duration.endTime.toString() > currentTime
    ) {
      accepted = true;
    } else {
      accepted = false;
    }
    // accepted = true;
    if (req.decoded.admin) {
      accepted = true;
    }
    if (moment(today).isAfter(duration.date.toString())) {
      accepted = true;
    }
    res.send({
      success: accepted,
      message: "Contest window isn't open!",
    });
  });
});

app.post("/validateMcq", middleware.checkToken, async (req, res) => {
  if (req.body.contestId) {
    contests.getDuration(req, (err, duration) => {
      if (err) {
        res.status(404).send({ message: err });
      }
      let date = new Date();
      let today = date.toLocaleDateString();
      if (today.length === 9) {
        today = "0" + today;
      }

      let day = date.getDate();
      if (day < 10) {
        day = "0" + String(day);
      }
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = "0" + String(month);
      }
      let year = date.getFullYear();

      if (!localServer) {
        today = `${year}-${day}-${month}`;
      } else {
        today = `${year}-${month}-${day}`;
      }

      let minutes = date.getMinutes();
      let hours = date.getHours();
      if (hours < 10) {
        hours = "0" + String(hours);
      }

      if (minutes < 10) {
        minutes = "0" + String(minutes);
      }

      let currentTime = `${hours}${minutes}`;
      currentTime = eval(currentTime);
      currentTime = moment().tz("Asia/Kolkata").format("HHmm");
      if (
        duration.date.toString() === today &&
        duration.startTime.toString() < currentTime &&
        duration.endTime.toString() > currentTime
      ) {
        accepted = true;
      } else {
        accepted = false;
      }
      if (req.decoded.admin) {
        accepted = true;
      }
      if (accepted) {
        let result = {
          contestId: req.body.contestId,
          participationId: req.decoded.username + req.body.contestId,
          mcqId: req.body.mcqId,
          questionNum: req.body.questionNum,
          answer: req.body.answer,
          section: req.body.section,
          check: true,
        };
        // check user time left
        participations.findUserTime(result, (err, participation) => {
          if (err) {
            res.status(404).send({ message: err });
          }
          participation = participation[0];
          let momentDate = new moment();
          let validTime = participation.validTill;

          if (
            momentDate.isBefore(participation.validTill) ||
            req.decoded.admin
          ) {
            participations.acceptSelection(result, (err, doc) => {
              if (err) {
                res.status(404).send({ message: err });
              } else {
                res.send(doc);
              }
            });
            // .catch((err)=>{
            //   res.status(500).send({
            //     message:
            //       "Server is Busy, try again later! or check your code for any compilation errors, and try again.",
            //   });
            // });
          } else {
            res.status(403).send({ message: "Your test duration has expired" });
          }
        });
        // .catch((err)=>{
        //   res.status(500).send({
        //     message:
        //       "Some error occurred while retrieving user time.",
        //   });
        // });
      } else {
        res.status(403).send({ message: "The contest window is not open" });
      }
    });
    // .catch((err)=>{
    //   res.status(500).send({
    //     message:
    //       "Some error occurred while retrieving contest duration.",
    //   });
    // });
  }
});

app.post("/validateSubmission", middleware.checkToken, async (req, res) => {
  let options11 = {
    method: "get",
    json: true,
    url: process.env.clientAddress + "/userSession/" + req.body.user,
  };
  request(options11, function (err, response, body) {
    if (!body.status || err)
      return res.status(404).send({ message: "user logged out!" });
  });

  if (req.body.contestId.length !== 0) {
    contests.getDuration(req, (err, duration) => {
      if (err) {
        res.status(404).send({ message: err });
      }

      let date = new Date();
      let today = date.toLocaleDateString();
      if (today.length === 9) {
        today = "0" + today;
      }

      // let day = today.slice(0, 2);
      // let month = today.slice(3, 5);
      // let year = today.slice(6, 10);

      let day = date.getDate();
      if (day < 10) {
        day = "0" + String(day);
      }
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = "0" + String(month);
      }
      let year = date.getFullYear();

      if (!localServer) {
        today = `${year}-${day}-${month}`;
      } else {
        today = `${year}-${month}-${day}`;
      }

      let minutes = date.getMinutes();
      let hours = date.getHours();
      if (hours < 10) {
        hours = "0" + String(hours);
      }

      if (minutes < 10) {
        minutes = "0" + String(minutes);
      }

      let currentTime = `${hours}${minutes}`;
      currentTime = eval(currentTime);
      currentTime = moment().tz("Asia/Kolkata").format("HHmm");
      if (
        duration.date.toString() === today &&
        duration.startTime.toString() < currentTime &&
        duration.endTime.toString() > currentTime
      ) {
        accepted = true;
      } else {
        accepted = false;
      }
      if (req.decoded.admin) {
        accepted = true;
      }
      // if (req.duration.contestId.slice(0,2) === "BW"){
      //   accepted = true;
      // }
      // accepted = true;
      if (accepted) {
        questions.getTestCases(req, (err, testcases) => {
          if (err) {
            res.status(404).send({
              message: "Question not found with id " + req.body.questionId,
            });
          } else {
            if (localServer) {
              postUrl = apiAddress + "/submissions/?wait=true";
            } else {
              postUrl = apiAddress + "/submissions";
            }
            let options1 = {
              method: "post",
              body: {
                source_code: req.body.source_code,
                language_id: req.body.language_id,
                stdin: testcases.HI1,
                expected_output: testcases.HO1,
              },
              json: true,
              url: postUrl,
            };

            let options2 = {
              method: "post",
              body: {
                source_code: req.body.source_code,
                language_id: req.body.language_id,
                stdin: testcases.HI2,
                expected_output: testcases.HO2,
              },
              json: true,
              url: postUrl,
            };

            let options3 = {
              method: "post",
              body: {
                source_code: req.body.source_code,
                language_id: req.body.language_id,
                stdin: testcases.HI3,
                expected_output: testcases.HO3,
              },
              json: true,
              url: postUrl,
            };

            let result = {
              contestId: testcases.contestId,
              participationId: req.decoded.username + testcases.contestId,
              check: duration.mcq,
            };
            // check user time left

            participations.findUserTime(result, (err, participation) => {
              if (err) {
                res.status(404).send({ message: err });
              }
              participation = participation[0];
              let momentDate = new moment();
              let validTime = participation.validTill;

              // participation.validTill = validTime.slice(4, validTime.length-9);
              if (
                momentDate.isBefore(participation.validTill) ||
                req.decoded.admin
              ) {
                // if (true){
                setTimeout(() => {
                  request(options1, function (err, response, body) {
                    if (err) {
                      res.status(404).send({ message: err });
                    }
                    result.token1 = body.token;
                    setTimeout(() => {
                      request(options2, function (err, response, body) {
                        if (err) {
                          res.status(404).send({ message: err });
                        }
                        result.token2 = body.token;
                        setTimeout(() => {
                          request(options3, function (err, response, body) {
                            if (err) {
                              res.status(404).send({ message: err });
                            }
                            result.token3 = body.token;
                            if (
                              result.token1 &&
                              result.token2 &&
                              result.token3
                            ) {
                              option1 = {
                                url:
                                  apiAddress + "/submissions/" + result.token1,
                                method: "get",
                              };
                              option2 = {
                                url:
                                  apiAddress + "/submissions/" + result.token2,
                                method: "get",
                              };
                              option3 = {
                                url:
                                  apiAddress + "/submissions/" + result.token3,
                                method: "get",
                              };

                              setTimeout(() => {
                                request(
                                  option1,
                                  function (err, response, body) {
                                    if (err) {
                                      res.status(404).send({ message: err });
                                    }
                                    let data = JSON.parse(body);

                                    let resp = data.status.description;
                                    result.response1 = resp;
                                    setTimeout(() => {
                                      request(
                                        option2,
                                        function (err, response, body) {
                                          if (err) {
                                            res
                                              .status(404)
                                              .send({ message: err });
                                          }
                                          let data = JSON.parse(body);

                                          let resp = data.status.description;
                                          result.response2 = resp;

                                          setTimeout(() => {
                                            request(
                                              option3,
                                              function (err, response, body) {
                                                if (err) {
                                                  res
                                                    .status(404)
                                                    .send({ message: err });
                                                }
                                                let data = JSON.parse(body);

                                                let resp =
                                                  data.status.description;
                                                result.response3 = resp;
                                                // End of chain

                                                result.languageId =
                                                  req.body.language_id;
                                                result.questionId =
                                                  req.body.questionId;
                                                result.username =
                                                  req.decoded.username;
                                                result.sourceCode =
                                                  req.body.source_code;
                                                result.submissionToken = [
                                                  result.token1,
                                                  result.token2,
                                                  result.token3,
                                                ];
                                                result.result = [
                                                  result.response1,
                                                  result.response2,
                                                  result.response3,
                                                ];
                                                result.participationId =
                                                  result.username +
                                                  result.contestId;
                                                result.clientIp =
                                                  requestIp.getClientIp(req);
                                                var testcasesPassed = 0;
                                                if (
                                                  result.response1 ===
                                                  "Accepted"
                                                ) {
                                                  testcasesPassed += 1;
                                                }
                                                if (
                                                  result.response2 ===
                                                  "Accepted"
                                                ) {
                                                  testcasesPassed += 1;
                                                }
                                                if (
                                                  result.response3 ===
                                                  "Accepted"
                                                ) {
                                                  testcasesPassed += 1;
                                                }
                                                if (testcasesPassed === 3) {
                                                  result.score = 100;
                                                } else if (
                                                  testcasesPassed === 2
                                                ) {
                                                  result.score = 50;
                                                } else if (
                                                  testcasesPassed === 1
                                                ) {
                                                  result.score = 25;
                                                } else {
                                                  result.score = 0;
                                                }

                                                // Add score to profile
                                                participations.acceptSubmission(
                                                  result,
                                                  (err, doc) => {
                                                    if (err) {
                                                      res
                                                        .status(404)
                                                        .send({ message: err });
                                                    }
                                                    // Create a submission
                                                    submissions.create(
                                                      req,
                                                      result,
                                                      (err, sub) => {
                                                        if (err) {
                                                          res.status(404).send({
                                                            message: err,
                                                          });
                                                        } else {
                                                          res.send(sub);
                                                        }
                                                      }
                                                    );
                                                  }
                                                );
                                              }
                                            );
                                          }, timeOut);
                                        }
                                      );
                                    }, timeOut);
                                  }
                                );
                              }, timeOut);
                            } else {
                              res.status(500).send({
                                message:
                                  "Server is Busy, try again later! or check your code for any compilation errors, and try again.",
                              });
                            }
                          });
                        }, timeOut);
                      });
                    }, timeOut);
                  });
                }, timeOut);
              } else {
                res
                  .status(403)
                  .send({ message: "Your test duration has expired" });
              }
            });
          }
        });
      } else {
        res.status(403).send({ message: "The contest window is not open" });
      }
    });
  } else {
    // Course Validation
    courses.findCourseLanguage(req, (err, course) => {
      course = course[0];
      if (err) {
        res
          .status(404)
          .send({ message: "Course not found with id " + req.body.courseId });
      }
      if (course.languageId === req.body.language_id) {
        questions.getTestCases(req, (err, testcases) => {
          if (err) {
            res.status(404).send({
              message: "Question not found with id " + req.body.questionId,
            });
          } else {
            if (localServer) {
              postUrl = apiAddress + "/submissions/?wait=true";
            } else {
              postUrl = apiAddress + "/submissions";
            }
            let options1 = {
              method: "post",
              body: {
                source_code: req.body.source_code,
                language_id: req.body.language_id,
                stdin: testcases.HI1,
                expected_output: testcases.HO1,
              },
              json: true,
              url: postUrl,
            };

            let options2 = {
              method: "post",
              body: {
                source_code: req.body.source_code,
                language_id: req.body.language_id,
                stdin: testcases.HI2,
                expected_output: testcases.HO2,
              },
              json: true,
              url: postUrl,
            };

            let options3 = {
              method: "post",
              body: {
                source_code: req.body.source_code,
                language_id: req.body.language_id,
                stdin: testcases.HI3,
                expected_output: testcases.HO3,
              },
              json: true,
              url: postUrl,
            };

            let result = {
              difficulty: testcases.difficulty,
              language: testcases.language,
              participationId: req.decoded.username + req.body.courseId,
              courseId: req.body.courseId,
            };
            participationsTut.findUserPart(result, (err, participation) => {
              if (err) {
                res.status(404).send({ message: err });
              }
              participation = participation[0];

              setTimeout(() => {
                request(options1, (err, resp, body) => {
                  if (err) {
                    res.status(404).send({ message: err });
                  }
                  result.token1 = body.token;
                  setTimeout(() => {
                    request(options2, (err, resp, body) => {
                      if (err) {
                        res.status(404).send({ message: err });
                      }
                      result.token2 = body.token;
                      setTimeout(() => {
                        request(options3, (err, resp, body) => {
                          if (err) {
                            res.status(404).send({ message: err });
                          }
                          result.token3 = body.token;
                          if (result.token1 && result.token2 && result.token3) {
                            option1 = {
                              url: apiAddress + "/submissions/" + result.token1,
                              method: "get",
                            };
                            option2 = {
                              url: apiAddress + "/submissions/" + result.token2,
                              method: "get",
                            };
                            option3 = {
                              url: apiAddress + "/submissions/" + result.token3,
                              method: "get",
                            };
                            setTimeout(() => {
                              request(option1, (err, response, body) => {
                                if (err) {
                                  res.status(404).send({ message: err });
                                }
                                let data = JSON.parse(body);

                                let resp = data.status.description;
                                result.response1 = resp;
                                setTimeout(() => {
                                  request(option2, (err, response, body) => {
                                    if (err) {
                                      res.status(404).send({ message: err });
                                    }
                                    let data = JSON.parse(body);

                                    let resp = data.status.description;
                                    result.response2 = resp;
                                    setTimeout(() => {
                                      request(
                                        option3,
                                        (err, response, body) => {
                                          if (err) {
                                            res
                                              .status(404)
                                              .send({ message: err });
                                          }
                                          let data = JSON.parse(body);

                                          let resp = data.status.description;
                                          result.response3 = resp;

                                          result.languageId =
                                            req.body.language_id;
                                          result.questionId =
                                            req.body.questionId;
                                          result.username =
                                            req.decoded.username;
                                          result.sourceCode =
                                            req.body.source_code;
                                          result.submissionToken = [
                                            result.token1,
                                            result.token2,
                                            result.token3,
                                          ];
                                          result.result = [
                                            result.response1,
                                            result.response2,
                                            result.response3,
                                          ];
                                          var testcasesPassed = 0;
                                          if (result.response1 === "Accepted") {
                                            testcasesPassed += 1;
                                          }
                                          if (result.response2 === "Accepted") {
                                            testcasesPassed += 1;
                                          }
                                          if (result.response3 === "Accepted") {
                                            testcasesPassed += 1;
                                          }
                                          if (testcasesPassed === 3) {
                                            result.score = 100;
                                          } else if (testcasesPassed === 2) {
                                            result.score = 50;
                                          } else if (testcasesPassed === 1) {
                                            result.score = 25;
                                          } else {
                                            result.score = 0;
                                          }
                                          // Add score to profile
                                          participationsTut.insertDifficultyWise(
                                            result,
                                            (err, doc) => {
                                              if (err) {
                                                res
                                                  .status(404)
                                                  .send({ message: err });
                                              }
                                              // Create a submission
                                              submissions.create(
                                                req,
                                                result,
                                                (err, sub) => {
                                                  if (err) {
                                                    res
                                                      .status(404)
                                                      .send({ message: err });
                                                  }
                                                  res.send(sub);
                                                }
                                              );
                                            }
                                          );
                                        }
                                      );
                                    }, timeOut);
                                  });
                                }, timeOut);
                              });
                            }, timeOut);
                          } else {
                            res.status(500).send({
                              message:
                                "Server is Busy, try again later! or check your code for any compilation errors and try again.",
                            });
                          }
                        });
                      }, timeOut);
                    });
                  }, timeOut);
                });
              }, timeOut);
            });
          }
        });
      } else {
        res
          .status(500)
          .send({ message: "This language is not allowed for this course" });
      }
    });
  }
});

app.get("/getScores", middleware.checkToken, async (req, res) => {
  let username = req.decoded.username;
  // let contestId = req.cookies.contestId || req.body.contestId;
  let contestId = req.body.contestId;
  let result = {};
  let finalScores = {};
  let allQuestions = [];
  let scores = [];
  req.cookies.contestId = contestId;
  result.participationId = username + contestId;
  questions.getAllQuestions(req, (err, question) => {
    if (err) {
      res.send(err);
    }
    for (let i = 0; i < question.length; i++) {
      allQuestions[i] = question[i].questionId;
    }
    participations.findUserTime(result, (err, participation) => {
      if (err) {
        res.send(err);
      }
      if (participation.length !== 0) {
        participation = participation[0];
        for (let i = 0; i < allQuestions.length; i++) {
          let maxScore = 0;
          for (let j = 0; j < participation.submissionResults.length; j++) {
            if (
              participation.submissionResults[j].questionId === allQuestions[i]
            ) {
              if (maxScore < participation.submissionResults[j].score) {
                maxScore = participation.submissionResults[j].score;
              }
            }
          }
          scores[i] = maxScore;
        }
        for (let i = 0; i < allQuestions.length; i++) {
          finalScores[allQuestions[i]] = {
            questionId: allQuestions[i],
            score: scores[i],
          };
          if (scores[i] === 100) {
            finalScores[allQuestions[i]].color = "green";
          } else if (score[i] === 50) {
            finalScores[allQuestions[i]].color = "orange";
          } else if (scores[i] === 25) {
            finalScores[allQuestions[i]].color = "red";
          } else {
            finalScores[allQuestions[i]].color = "black";
          }
        }
      } else {
        for (let i = 0; i < allQuestions.length; i++) {
          finalScores[allQuestions[i]] = {
            questionId: allQuestions[i],
            score: 0,
            color: "black",
          };
        }
      }
      res.send(finalScores);
    });
  });

  // res.end();
});

app.get("/retrieveScores", middleware.checkToken, async (req, res) => {
  let username = req.decoded.username;
  // let contestId = req.cookies.contestId || req.body.contestId;
  let contestId = req.body.contestId;
  let result = {};
  let finalScores = {};
  let allQuestions = [];
  let scores = [];
  req.cookies.contestId = contestId;
  result.participationId = username + "Course";
  questions.getAllQuestions(req, (err, question) => {
    if (err) {
      res.send(err);
    }
    for (let i = 0; i < question.length; i++) {
      allQuestions[i] = question[i].questionId;
    }
    participations.findUserPart(result, (err, participation) => {
      if (err) {
        res.send(err);
      }
      if (participation.length !== 0) {
        participation = participation[0];
        for (let i = 0; i < allQuestions.length; i++) {
          let maxScore = 0;
          for (let j = 0; j < participation.submissionResults.length; j++) {
            if (
              participation.submissionResults[j].questionId === allQuestions[i]
            ) {
              if (maxScore < participation.submissionResults[j].score) {
                maxScore = participation.submissionResults[j].score;
              }
            }
          }
          scores[i] = maxScore;
        }
        for (let j = 0; j < allQuestions.length; j++) {
          finalScores[allQuestions[j]] = {
            questionId: allQuestions[j],
            score: scores[j],
          };
          if (scores[j] === 100) {
            finalScores[allQuestions[j]].color = "green";
          } else if (score[j] === 50) {
            finalScores[allQuestions[j]].color = "orange";
          } else if (scores[j] === 25) {
            finalScores[allQuestions[j]].color = "red";
          } else {
            finalScores[allQuestions[j]].color = "black";
          }
        }
      } else {
        for (let i = 0; i < allQuestions.length; i++) {
          finalScores[allQuestions[i]] = {
            questionId: allQuestions[i],
            score: 0,
            color: "black",
          };
        }
      }
      res.send(finalScores);
    });
  });
});

app.get("/isAdmin", middleware.checkTokenAdmin, async (req, res) => {
  res.send({
    success: true,
  });
});

app.get("/pdf/:setno", middleware.checkToken, async (req, res) => {
  res.sendFile(path.resolve("../Public/pdf/" + req.params.setno + ".pdf"));
});

app.get("/genReport/:questionId", middleware.checkToken, async (req, res) => {
  let questionId = req.params.questionId;
  res.sendFile(
    path.resolve(
      "../Public/source_codes/" + questionId + "/" + questionId + ".zip"
    )
  );
});

app.post("/uploadpdf", middleware.checkTokenAdmin, async (req, res) => {
  if (req.files) {
    let file = req.files.upfile,
      filename = file.name;
    file.mv("../Public/pdf/" + filename, function (err) {
      if (err) {
        res.send("error occured");
      } else {
        res.json({
          success: true,
          message: "uploaded",
          filename: filename,
        });
      }
    });
  } else {
    res.send("Failed");
  }
});

app.post("/updateLeaderboard", middleware.checkTokenAdmin, async (req, res) => {
  if (req.files) {
    let file = req.files.upfile,
      filename = "current_leaderboard";
    file.mv("../Public/" + filename, function (err) {
      if (err) {
        res.send("error occured");
      } else {
        res.json({
          success: true,
          message: "uploaded",
          filename: filename,
        });
      }
    });
  } else {
    res.send("Failed");
  }
});

app.get("/getSolvedCount", middleware.checkTokenAdmin, async (req, res) => {
  let users = await User.find();
  let userCollection = {};
  for (const user of users) {
    userCollection[user.username] = 0;
  }

  let userParticipations = await Participation.find();
  let tutorialParticipations = await ParticipationTut.find();
  userParticipations = userParticipations.concat(tutorialParticipations);

  for (const uPart of userParticipations) {
    let incVal = 0;
    for (const submission of uPart.submissionResults) {
      if (submission.score === 100) {
        incVal = incVal + 1;
      }
    }
    if (uPart.username in userCollection) {
      userCollection[uPart.username] += incVal;
    }
  }
  res.send(userCollection);
});

// get latest plag report
app.get("/plagreport/:languageId/:questionId", async (req, res) => {
  let questionId = req.params.questionId;
  let languageId = req.params.languageId;
  let p = path.resolve(
    "../Public/source_codes/" + questionId + "/" + languageId + "-result"
  );

  function zipDirectory(source, out) {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
      archive
        .directory(source, false)
        .on("error", (err) => reject(err))
        .pipe(stream);

      stream.on("close", () => resolve());
      archive.finalize();
    });
  }
  zipDirectory(p, p + "/result.zip")
    .then(res.sendFile(p + "/result.zip"))
    .catch(res.send("Failed"));
});

schedule.scheduleJob("59 23 * * *", async function () {
  await Count.findOneAndUpdate(
    {},
    {
      $set: {
        day: 0,
      },
    }
  );
});

schedule.scheduleJob("59 23 * * 0", async function () {
  await Count.findOneAndUpdate(
    {},
    {
      $set: {
        week: 0,
      },
    }
  );
});

schedule.scheduleJob("59 23 * * 0", async function () {
  await SkillUp.findAll(async (err, skillUps) => {
    skillUps.forEach(async (skillUp) => {
      await SkillUp.update(skillUp, (err, res) => {
        console.log("Updated!");
      });
    });
    // await SkillUp.update(skil)
  });
});
app.listen(port, () => console.log("Server @ port", port));
