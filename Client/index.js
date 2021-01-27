const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const request = require("request");
const urlExists = require("url-exists");
const cookieParser = require("cookie-parser");
var path = require("path");
let config = require("../Server/util/config");
const xlsx = require("xlsx");
const fs = require("fs");
const fetch = require("node-fetch");

let serverRoute = config.serverAddress;
let clientRoute = config.clientAddress;

const app = express();
app.options("*", cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(cookieParser());

app.use("/", express.static(__dirname + "/"));
app.use("/ide", express.static(path.resolve("../IDE")));

app.use("/tutorials", express.static(__dirname + "/"));
app.use("/contests", express.static(__dirname + "/"));

app.use("/contests/questions", express.static(__dirname + "/"));
app.use("/tutorials/questions", express.static(__dirname + "/"));

app.use("/admin", express.static(__dirname + "/"));

app.get("/", async (req, res) => {
  res.render("home", { imgUsername: req.cookies.username });
});
app.get("/index", async (req, res) => {
  res.render("home", { imgUsername: req.cookies.username });
});
app.get("/home", async (req, res) => {
  res.render("home", { imgUsername: req.cookies.username });
});
app.get("/about", async (req, res) => {
  res.render("about", { imgUsername: req.cookies.username });
});
app.get("/leaderboard", async (req, res) => {
  let filePath = "../Public/current_leaderboard";
  if (fs.existsSync(filePath)) {
    let wb = xlsx.readFile(filePath);
    let ws = wb.Sheets["Sheet1"];
    let data = xlsx.utils.sheet_to_json(ws);
    let headers = [
      "Rank",
      "Roll Number",
      "Name",
      "HackerRank (HR)",
      "CodeChef (CC)",
      "Codeforces (CF)",
      "InterviewBit (IB)",
      "Spoj (S)",
      "BuildIT",
      "Overall Score",
      "Weekly Performance",
    ];
    let toppers = [
      data[0]["Roll Number"],
      data[1]["Roll Number"],
      data[2]["Roll Number"],
    ];
    const [firstResponse, secondResponse, thirdResponse] = await Promise.all([
      fetch(`${serverRoute}/users/branch/${toppers[0]}`),
      fetch(`${serverRoute}/users/branch/${toppers[1]}`),
      fetch(`${serverRoute}/users/branch/${toppers[2]}`),
    ]);

    const first = await firstResponse.json();
    const second = await secondResponse.json();
    const third = await thirdResponse.json();

    const topperData = [first, second, third];

    res.render("leaderboard", {
      imgUsername: req.cookies.username,
      data: data,
      headers: headers,
      toppers: topperData,
    });
  } else {
    res.render("error", {
      data: { message: "Leaderboard not initialised" },
      imgUsername: req.cookies.username,
    });
  }
});

app.get("/profile", async (req, res) => {
  let options = {
    url: serverRoute + "/users/" + req.cookies.username.toLowerCase(),
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    body.branchCaps = body.branch.toUpperCase();
    let branch = body.branch;
    let imageUrl = "https://iare-data.s3.ap-south-1.amazonaws.com/uploads/";
    let rollno = req.cookies.username;
    let testUrl = imageUrl + branch + "/" + rollno + ".jpg";
    urlExists(testUrl, function (err, exists) {
      if (exists) {
        body.imgUrl = testUrl;
        res.render("profile", {
          data: body,
          imgUsername: req.cookies.username,
        });
      } else {
        body.imgUrl = "./images/defaultuser.png";
        res.render("profile", {
          data: body,
          imgUsername: req.cookies.username,
        });
      }
    });
  });
});

app.get("/login", async (req, res) => {
  let url = {
    url: clientRoute,
  };
  res.render("login", { data: url });
});

app.get("/forgotpassword_", async (req, res) => {
  let url = {
    url: clientRoute + "/fp",
  };
  res.render("forgotPassword", { data: url });
});

app.get("/admin/add/tutQuestion", async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute,
  };

  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    if (body.success) {
      res.render("tutQuestionAdd", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/add/question", async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute,
  };

  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    if (body.success) {
      res.render("questionadd", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/add/pdf", async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute,
  };

  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    if (body.success) {
      res.render("uploadpdf", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/add/leaderboard", async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute,
  };

  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    if (body.success) {
      res.render("uploadcsv", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/add/contest", async (req, res) => {
  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    let url = {
      url: clientRoute,
      serverurl: serverRoute,
    };
    if (body.success) {
      res.render("contestadd", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      console.log("token " + req.cookies.token);
      res.render("error", {
        data: body,
        imgUsername: req.cookies.username,
      });
    }
  });
});

app.get("/admin/update/question", async (req, res) => {
  let url = {
    url: clientRoute,
  };
  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    if (body.success) {
      res.render("questionupdate", { data: url });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/update/contest", async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute,
  };
  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    if (body.success) {
      res.render("contestupdate", { data: url });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/add/questionTut", async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute,
  };

  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    if (body.success) {
      res.render("questionTutAdd", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/add/course", async (req, res) => {
  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    let url = {
      url: clientRoute,
      serverurl: serverRoute,
    };
    if (body.success) {
      res.render("courseAdd", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/delete/contest", async (req, res) => {
  let options = {
    url: serverRoute + "/contests",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    body.posturl = clientRoute + "/contestDelete";
    body.url = clientRoute;
    body.method = "POST";
    body.class = "btn-danger";
    body.title = "Delete";
    res.render("dropdown", { data: body });
  });
});

app.get("/admin/delete/question", async (req, res) => {
  let options = {
    url: serverRoute + "/questions",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    body.posturl = clientRoute + "/contestDelete";
    body.url = clientRoute;
    body.method = "POST";
    body.class = "btn-danger";
    body.title = "Delete";
    body.subtitle = "Questions";
    res.render("dropdown", { data: body });
  });
});

app.post("/contestDelete", async (req, res) => {
  let options = {
    url: serverRoute + "/contests/" + req.body.contestId,
    method: "delete",
    body: {
      contestId: req.body.contestId,
      token: req.cookies.token,
    },
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    res.redirect("/admin/delete/contest");
  });
});

app.post("/questionDelete", async (req, res) => {
  let options = {
    url: serverRoute + "/questions/" + req.body.questionId,
    method: "post",
    body: {
      questionId: req.body.questionId,
      token: req.cookies.token,
    },
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    res.redirect("/admin/delete/question");
  });
});

app.get("/admin/update/questionTut", async (req, res) => {
  let url = {
    url: clientRoute,
  };
  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    if (body.success) {
      res.render("questionTutUpdate", { data: url });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/update/course", async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute,
  };
  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    if (body.success) {
      res.render("courseUpdate", { data: url });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/manageusers", async (req, res) => {
  let options = {
    url: serverRoute + "/admin/users",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    body.url = clientRoute;
    body.serverurl = serverRoute;
    for (let i = 0; i < body.length; i++) {
      if (!body[i].isVerified) {
        body[i].color = "pink";
      }
    }
    res.render("manageusers", { data: body });
  });
});

app.get("/admin/complaints", async (req, res) => {
  let options = {
    url: serverRoute + "/complains",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    body.url = clientRoute;
    body.serverurl = serverRoute;
    res.render("admincomplain", { data: body });
  });
});

app.get("/complaints_public", async (req, res) => {
  let options = {
    url: serverRoute + "/complains",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    body.url = clientRoute;
    body.serverurl = serverRoute;
    res.render("complains_public", { data: body });
  });
});

app.get("/admin/deleteuser/:username", async (req, res) => {
  let options = {
    url: serverRoute + "/users/" + req.params.username,
    method: "delete",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    res.redirect("/admin/manageusers");
  });
});

app.get("/admin/deletecomplain/:questionId", async (req, res) => {
  let options = {
    url: serverRoute + "/complains/" + req.params.questionId,
    method: "delete",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    res.redirect("/admin/complaints");
  });
});

app.get("/admin/results", async (req, res) => {
  let options = {
    url: serverRoute + "/contests",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    body.posturl = clientRoute + "/admin/results/contest";
    body.url = clientRoute;
    body.method = "POST";
    res.render("dropdown", { data: body });
  });
});

app.get("/admin/resultsTut", async (req, res) => {
  let options = {
    url: serverRoute + "/courses",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    body.posturl = clientRoute + "/admin/resultsTut/course";
    body.url = clientRoute;
    body.method = "POST";
    res.render("dropdown2", { data: body });
  });
});

app.get("/admin/move", async (req, res) => {
  let options = {
    url: serverRoute + "/questions",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    let options = {
      url: serverRoute + "/courses",
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };
    request(options, function (err, response, bodyCourses) {
      body.posturl = serverRoute + "/questions/mergeCourse";
      body.method = "POST";
      res.render("moveToCourse", { data: body, dataCourse: bodyCourses });
    });
  });
});

app.post("/admin/results/contest", async (req, res) => {
  let options = {
    url: serverRoute + "/participations/all",
    method: "post",
    body: {
      contestId: req.body.contestId,
    },
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, bodyparticipation) {
    let options = {
      url: serverRoute + "/questions/contests/" + req.body.contestId,
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };

    request(options, function (err, response, bodyquestion) {
      let url = {
        url: clientRoute,
      };
      res.render("results", {
        data: url,
        datap: bodyparticipation,
        dataq: bodyquestion,
      });
    });
  });
});

app.get("/admin/solved", async (req, res) => {
  let options = {
    url: serverRoute + "/getSolvedCount",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    let url = {
      url: clientRoute,
    };
    res.render("solvedCount", {
      data: url,
      solved: body,
    });
  });
});

app.post("/admin/resultsTut/course", async (req, res) => {
  let options = {
    url: serverRoute + "/tparticipations/all",
    method: "post",
    body: {
      courseId: req.body.courseId,
    },
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, bodytimer) {
    let options2 = {
      url: serverRoute + "/questions/courses/" + req.body.courseId,
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };
    let course = {
      course: req.body.courseId,
    };
    request(options2, function (err, response, body1) {
      let eCount = 0;
      let mCount = 0;
      let hCount = 0;
      let cCount = 0;
      for (let i = 0; i < body1.length; i++) {
        if (body1[i].difficulty === "level_0") {
          eCount++;
        } else if (body1[i].difficulty === "level_1") {
          mCount++;
        } else if (body1[i].difficulty === "level_2") {
          hCount++;
        } else if (body1[i].difficulty === "contest") {
          cCount++;
        }
      }
      let j = 0;
      while (j < bodytimer.length) {
        let totalSolEasy = 0;
        let totalSolMedium = 0;
        let totalSolHard = 0;
        let totalSolContest = 0;
        // console.log(eCount,mCount,hCount,cCount);
        totalSolEasy = bodytimer[j].easySolved.length;
        totalSolMedium = bodytimer[j].mediumSolved.length;
        totalSolHard = bodytimer[j].hardSolved.length;
        totalSolContest = bodytimer[j].contestSolved.length;
        bodytimer[j].easyPercentage = Math.ceil((totalSolEasy / eCount) * 100);
        bodytimer[j].mediumPercentage = Math.ceil(
          (totalSolMedium / mCount) * 100
        );
        bodytimer[j].hardPercentage = Math.ceil((totalSolHard / hCount) * 100);
        bodytimer[j].contestPercentage = Math.ceil(
          (totalSolContest / cCount) * 100
        );
        bodytimer[j].clientRoute = clientRoute;
        bodytimer[j].serverRoute = serverRoute;
        j = j + 1;
      }

      res.render("results1", { datac: course, data: bodytimer });
    });
  });
});

app.get("/contests/:contestId/leaderboard", async (req, res) => {
  let options = {
    url: serverRoute + "/participations/all",
    method: "post",
    body: {
      contestId: req.params.contestId,
    },
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, bodyparticipation) {
    let options = {
      url: serverRoute + "/questions/contests/" + req.params.contestId,
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };

    request(options, function (err, response, bodyquestion) {
      let url = {
        url: clientRoute,
      };
      res.render("results_public2", {
        data: url,
        datap: bodyparticipation,
        dataq: bodyquestion,
      });
    });
  });
});

app.get("/admin", async (req, res) => {
  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    let url = {
      url: clientRoute,
      serverurl: serverRoute,
    };
    if (body.success) {
      res.render("contestadd", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/ide/:questionId", async (req, res) => {
  let questionId = req.params.questionId;
  res.sendFile(path.resolve("../IDE/index.html"));
});

app.get("/contest", async (req, res) => {
  let options = {
    url: serverRoute + "/contests",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    res.clearCookie("courseId");
    res.render("contest", { imgUsername: req.cookies.username, data: body });
  });
});

app.get("/contests/:contestId", async (req, res) => {
  // check if contest is open
  let options = {
    url: serverRoute + "/isOngoing",
    method: "post",
    headers: {
      authorization: req.cookies.token,
    },
    body: {
      contestId: req.params.contestId,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    if (body.success) {
      // Add participation
      let options1 = {
        url: serverRoute + "/participations",
        method: "post",
        headers: {
          authorization: req.cookies.token,
        },
        body: {
          contestId: req.params.contestId,
        },
        json: true,
      };

      request(options1, function (err, response, body) {
        let options = {
          url: serverRoute + "/questions/contests/" + req.params.contestId,
          method: "get",
          headers: {
            authorization: req.cookies.token,
          },
          json: true,
        };
        // Get questions for contest
        request(options, function (err, response, body) {
          res.cookie("contestId", req.params.contestId);
          let options3 = {
            url: serverRoute + "/participations/" + req.params.contestId,
            method: "get",
            headers: {
              authorization: req.cookies.token,
            },
            json: true,
          };
          // get participation details
          request(options3, function (err, response, bodytimer) {
            bodytimer = bodytimer[0];
            let questions = [];
            let scores = [];
            for (let i = 0; i < body.length; i++) {
              questions[i] = body[i].questionId;
            }
            for (let i = 0; i < questions.length; i++) {
              let maxScore = 0;
              for (let j = 0; j < bodytimer.submissionResults.length; j++) {
                if (
                  bodytimer.submissionResults[j].questionId === questions[i]
                ) {
                  if (maxScore < bodytimer.submissionResults[j].score) {
                    maxScore = bodytimer.submissionResults[j].score;
                  }
                }
              }
              scores[i] = maxScore;
            }
            for (let i = 0; i < body.length; i++) {
              for (let j = 0; j < questions.length; j++) {
                if (body[i].questionId === questions[j]) {
                  body[i].score = scores[j];
                }
              }
            }
            for (let i = 0; i < body.length; i++) {
              if (body[i].score === 100) {
                body[i].color = "green";
              } else if (body[i].score === 50) {
                body[i].color = "orange";
              } else if (body[i].score === 25) {
                body[i].color = "red";
              } else {
                body[i].color = "black";
              }
            }
            body.contestId = req.params.contestId;
            res.render("questions", {
              imgUsername: req.cookies.username,
              data: body,
              datatimer: bodytimer,
            });
          });
        });
      });
    } else {
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.post("/signup_", async (req, res) => {
  // res.render('/home');
  let options = {
    url: serverRoute + "/signup",
    method: "post",
    body: {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      password2: req.body.password2,
      branch: req.body.branch,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    if (body.username && body.password) {
      body.message =
        "Sign up successful, Account verification has been sent to your email";
    }
    body.url = clientRoute;
    res.render("error", { data: body, imgUsername: req.cookies.username });
  });
});

app.get("/registerComplaint/:questionId", async (req, res) => {
  body = {};
  body.posturl = clientRoute + "/complaint";
  body.url = clientRoute;
  body.questionId = req.params.questionId;
  body.method = "POST";
  res.render("complain", { data: body, imgUsername: req.cookies.username });
});

app.post("/complaint", async (req, res) => {
  let options = {
    url: serverRoute + "/complains",
    method: "post",
    headers: {
      authorization: req.cookies.token,
    },
    body: {
      complainId: req.cookies.username + req.body.questionId,
      complainSubject: req.body.complainSubject,
      username: req.cookies.username,
      complainDesc: req.body.complainDesc,
      questionId: req.body.questionId,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    if (
      body.username &&
      body.complainSubject &&
      body.complainDesc &&
      body.questionId
    ) {
      body.message = "Report Successfully Registered";
    }
    body.url = clientRoute;
    res.render("error", { data: body, imgUsername: req.cookies.username });
  });
});

app.post("/login_", async (req, res) => {
  let options = {
    url: serverRoute + "/login",
    method: "post",
    body: {
      username: req.body.username,
      password: req.body.password,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    if (body.success) {
      res.cookie("token", body.token);
      res.cookie("username", body.username);
      res.cookie("branch", body.branch);
      if (body.admin) {
        res.clearCookie("branch");
        res.redirect("admin");
      } else {
        let url = {
          url: clientRoute,
        };
        res.render("temp", { data: url, imgUsername: req.cookies.username });
      }
    } else {
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.post("/fp", async (req, res) => {
  let options = {
    url: serverRoute + "/forgotPass",
    method: "post",
    body: {
      username: req.body.username,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    if (body.success) {
      res.render("error", { data: body, imgUsername: req.cookies.username });
    } else {
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("username");
  res.clearCookie("contestId");
  res.clearCookie("courseId");
  res.clearCookie("branch");
  res.redirect("/");
});

app.get("/pdf/:setNo", async (req, res) => {
  res.redirect(serverRoute + "/pdf/" + req.params.setNo);
});

app.get("/error", async (req, res) => {
  res.render("error", { imgUsername: req.cookies.username });
});

app.get("/contests/questions/:questionId", async (req, res) => {
  let options = {
    url: serverRoute + "/questions/" + req.params.questionId,
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    body.url = clientRoute;
    res.render("questiondesc", {
      imgUsername: req.cookies.username,
      data: body,
    });
  });
});

app.get("/tutorials/questions/:questionId", async (req, res) => {
  let options = {
    url: serverRoute + "/questions/" + req.params.questionId,
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    body.url = clientRoute;
    res.render("questionTutDesc", {
      imgUsername: req.cookies.username,
      data: body,
    });
  });
});

app.get("/verify", async (req, res) => {
  // res.render('/home');
  let options = {
    url: serverRoute + "/verify",
    method: "post",
    body: {
      email: req.query.email,
      token: req.query.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    res.render("error", { data: body, imgUsername: req.cookies.username });
  });
});

// Tutorials Code

// app.get('/tutorials', async(req, res) => {
//   body = {};
//   body.message = "Coming Soon!";
//   res.render('error', {data: body, imgUsername: req.cookies.username});
// });

app.get("/flipClass", async (req, res) => {
  let url = {
    url: clientRoute,
    surl: serverRoute,
  };
  res.render("flipClass", { imgUsername: req.cookies.username, data: url });
});

app.get("/tutorials", async (req, res) => {
  let options = {
    url: serverRoute + "/courses",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    res.render("tutorials", { imgUsername: req.cookies.username, data: body });
  });
});

app.get("/tutorials/:courseId/progress", async (req, res) => {
  let options = {
    url: serverRoute + "/questions/courses/" + req.params.courseId,
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  // Get questions for contest
  request(options, function (err, response, body) {
    let options3 = {
      url: serverRoute + "/tparticipations/" + req.params.courseId,
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };
    // get participation details
    request(options3, function (err, response, bodytimer) {
      bodytimer = bodytimer[0];

      let totalSolEasy = 0;
      let totalSolMedium = 0;
      let totalSolHard = 0;
      let totalSolContest = 0;
      let eCount = 0;
      let mCount = 0;
      let hCount = 0;
      let cCount = 0;
      for (let i = 0; i < body.length; i++) {
        if (body[i].difficulty === "level_0") {
          eCount++;
        } else if (body[i].difficulty === "level_1") {
          mCount++;
        } else if (body[i].difficulty === "level_2") {
          hCount++;
        } else if (body[i].difficulty === "contest") {
          cCount++;
        }
      }
      totalSolEasy = bodytimer.easySolved.length;
      totalSolMedium = bodytimer.mediumSolved.length;
      totalSolHard = bodytimer.hardSolved.length;
      totalSolContest = bodytimer.contestSolved.length;
      req.params.courseId = req.params.courseId;
      body.easyPercentage = Math.ceil((totalSolEasy / eCount) * 100);
      body.mediumPercentage = Math.ceil((totalSolMedium / mCount) * 100);
      body.hardPercentage = Math.ceil((totalSolHard / hCount) * 100);
      body.contestPercentage = Math.ceil((totalSolContest / cCount) * 100);

      if (req.params.courseId === "IARE_PY") {
        body.courseName = "Python Proficiency";
        body.courseId = "IARE_PY";
      } else if (req.params.courseId === "IARE_C") {
        body.courseName = "C Proficiency";
        body.courseId = "IARE_C";
      } else if (req.params.courseId === "IARE_JAVA") {
        body.courseName = "Java Proficiency";
        body.courseId = "IARE_JAVA";
      } else if (req.params.courseId === "IARE_CPP") {
        body.courseName = "C++ Proficiency";
        body.courseId = "IARE_CPP";
      } else {
        body.courseName = "Invalid Course";
      }
      res.render("tutProgress", {
        imgUsername: req.cookies.username,
        data: body,
        datatimer: bodytimer,
      });
    });
  });
});

app.get("/tutorials/:courseId/:difficulty/:concept", async (req, res) => {
  let concept = req.params.concept;

  let subjectMap = ["bs", "cs", "al", "fn", "po", "so"];

  let reqConcept = subjectMap.indexOf(concept);

  let options = {
    url:
      serverRoute +
      "/questions/courses/" +
      req.params.courseId +
      "/" +
      req.params.difficulty +
      "/" +
      reqConcept,
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    let options3 = {
      url: serverRoute + "/tparticipations/" + req.params.courseId,
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };
    request(options3, function (err, response, bodytimer) {
      bodytimer = bodytimer[0];

      for (let i = 0; i < body.length; i++) {
        if (bodytimer.submissionResults.indexOf(body[i].questionId) !== -1) {
          body[i].solved = "Solved";
          body[i].color = "#DFF0D8";
        } else {
          body[i].solved = "Unsolved";
          body[i].color = "";
        }
      }

      body.url = clientRoute;
      // Course Name
      if (req.params.courseId === "IARE_PY") {
        body.courseName = "Python Proficiency";
        body.courseId = "IARE_PY";
      } else if (req.params.courseId === "IARE_C") {
        body.courseName = "C Proficiency";
        body.courseId = "IARE_C";
      } else if (req.params.courseId === "IARE_JAVA") {
        body.courseName = "Java Proficiency";
        body.courseId = "IARE_JAVA";
      } else if (req.params.courseId === "IARE_CPP") {
        body.courseName = "C++ Proficiency";
        body.courseId = "IARE_CPP";
      } else {
        body.courseName = "Invalid Course";
      }
      // Course level
      if (req.params.concept === "bs") {
        body.courseName = body.courseName + " - Basics";
      } else if (req.params.concept === "cs") {
        body.courseName = body.courseName + " - Control Structures";
      } else if (req.params.concept === "al") {
        body.courseName = body.courseName + " - Arrays/Lists/Strings";
      } else if (req.params.concept === "po") {
        body.courseName = body.courseName + " - Pointers/Objects";
      } else if (req.params.concept === "so") {
        body.courseName = body.courseName + " - Structures/Objects";
      } else if (req.params.concept === "fn") {
        body.courseName = body.courseName + " - Functions";
      }
      res.render("displayTutQuestions", {
        imgUsername: req.cookies.username,
        data: body,
      });
    });
  });
});

app.get("/tutorials/:courseId/:difficulty", async (req, res) => {
  let options = {
    url:
      serverRoute +
      "/questions/courses/" +
      req.params.courseId +
      "/" +
      req.params.difficulty,
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    let options3 = {
      url: serverRoute + "/tparticipations/" + req.params.courseId,
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };
    request(options3, function (err, response, bodytimer) {
      bodytimer = bodytimer[0];

      for (let i = 0; i < body.length; i++) {
        if (bodytimer.submissionResults.indexOf(body[i].questionId) !== -1) {
          body[i].solved = "Solved";
          body[i].color = "#96f542";
        } else {
          body[i].solved = "Unsolved";
          body[i].color = "";
        }
      }

      body.url = clientRoute;
      if (req.params.courseId === "IARE_PY") {
        body.courseName = "Python Proficiency";
        body.courseId = "IARE_PY";
      } else if (req.params.courseId === "IARE_C") {
        body.courseName = "C Proficiency";
        body.courseId = "IARE_C";
      } else if (req.params.courseId === "IARE_JAVA") {
        body.courseName = "Java Proficiency";
        body.courseId = "IARE_JAVA";
      } else if (req.params.courseId === "IARE_CPP") {
        body.courseName = "C++ Proficiency";
        body.courseId = "IARE_CPP";
      } else {
        body.courseName = "Invalid Course";
      }
      // console.log(body, "\n ____________________________________________________________________");
      // console.log(bodytimer);
      res.render("displayTutQuestions", {
        imgUsername: req.cookies.username,
        data: body,
      });
    });
  });
});

app.get("/tutorials/:courseId", async (req, res) => {
  res.clearCookie("contestId");
  res.cookie("courseId", req.params.courseId);
  // Add participation
  let options1 = {
    url: serverRoute + "/tparticipations",
    method: "post",
    headers: {
      authorization: req.cookies.token,
    },
    body: {
      courseId: req.params.courseId,
    },
    json: true,
  };

  request(options1, function (err, response, body) {
    let options = {
      url: serverRoute + "/questions/courses/" + req.params.courseId,
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };
    // Get questions for contest
    request(options, function (err, response, body) {
      let options3 = {
        url: serverRoute + "/tparticipations/" + req.params.courseId,
        method: "get",
        headers: {
          authorization: req.cookies.token,
        },
        json: true,
      };
      // console.log(options3.url);
      // get participation details
      request(options3, function (err, response, bodytimer) {
        bodytimer = bodytimer[0];

        if (req.params.courseId === "IARE_PY") {
          body.courseName = "Python Proficiency";
          body.courseId = "IARE_PY";
        } else if (req.params.courseId === "IARE_C") {
          body.courseName = "C Proficiency";
          body.courseId = "IARE_C";
        } else if (req.params.courseId === "IARE_JAVA") {
          body.courseName = "Java Proficiency";
          body.courseId = "IARE_JAVA";
        } else if (req.params.courseId === "IARE_CPP") {
          body.courseName = "C++ Proficiency";
          body.courseId = "IARE_CPP";
        } else {
          body.courseName = "Invalid Course";
        }
        res.render("questionsTut", {
          imgUsername: req.cookies.username,
          data: body,
          datatimer: bodytimer,
        });
      });
    });
  });
});

app.listen(4000);
console.log("Server @ port 4000");
