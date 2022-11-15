const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const request = require("request");
const urlExists = require("url-exists");
const cookieParser = require("cookie-parser");
var path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");
const fetch = require("node-fetch");
var _ = require("lodash");
const dotenv = require("dotenv");
const { cookie } = require("request");
const { response } = require("express");

// Load config
dotenv.config({ path: "../Server/util/config.env" });

let serverRoute = process.env.serverAddress;
let clientRoute = process.env.clientAddress;

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
app.use("/qualifier_test/:contestId", express.static(__dirname + "/"));
app.use("/qualifierTestScore", express.static(__dirname + "/"));
app.use("/qualifier_tests", express.static(__dirname + "/"));
app.use(
  "/qualifier_tests/leaderboard/:contestId",
  express.static(__dirname + "/")
);

app.use("/contests/questions", express.static(__dirname + "/"));
app.use("/tutorials/questions", express.static(__dirname + "/"));

app.use("/admin/manageusers", express.static(__dirname + "/"));
app.use("/admin/unverifiedusers", express.static(__dirname + "/"));
app.use("/admin/contentDevProgress", express.static(__dirname + "/"));
app.use("/admin/deletequestions/multiple", express.static(__dirname + "/"));
app.use("/admin/add/practiceQuestion", express.static(__dirname + "/"));
app.use("/admin/viewResumes", express.static(__dirname + "/"));

app.use("/admin", express.static(__dirname + "/"));

let countApiKey = process.env.countApiKey;
let googleSheetsApi = process.env.googleSheetsApi;
let prevDate = new Date().getDate();
let weekCount = 0;
let totalCount = 0;

let userSessions = [];
let userSessions2 = [];

let sessionText = fs.readFileSync("./store.txt", "utf-8");

if (sessionText !== "") {
  userSessions2 = sessionText.split("\n");
  for (let i = 0; i < userSessions2.length; i++) {
    userSessions.push({
      username: userSessions2[i].substring(0, 10),
      val: Number(userSessions2[i].substring(10, 11)),
    });
  }
}

let checkSignIn = async (req, res, next) => {
  if (
    userSessions2.includes(req.cookies.user) ||
    Object.keys(req.cookies).length === 0
  ) {
    next(); //If session exists, proceed to page
  } else {
    res.redirect("/logout"); //Error, trying to access unauthorized page!
  }
};

var imageUrl = "";
function imageRetrive(req, res) {
  let imageUrl = "https://iare-data.s3.ap-south-1.amazonaws.com/uploads/";
  let rollno = req.cookies.username;
  let branch = req.cookies.branch;
  var testUrl = imageUrl + branch + "/" + rollno + ".jpg";
  return testUrl;
}

function loginCounts(req, res) {
  let options = {
    url: serverRoute + "/counters",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    if (body.success) {
      res.render("home", {
        imgUsername: req.cookies.username,
        dayCount: body.data[0].day,
        weeklyCount: body.data[0].week,
        totalCount: body.data[0].total,
        googleSheetsApi,
      });
    } else {
      res.render("home", {
        imgUsername: req.cookies.username,
        dayCount: 0,
        weeklyCount: 0,
        totalCount: 0,
        googleSheetsApi,
      });
    }
  });
}

app.get("/", async (req, res) => {
  loginCounts(req, res);
});
app.get("/index", async (req, res) => {
  loginCounts(req, res);
});
app.get("/home", checkSignIn, async (req, res, next) => {
  loginCounts(req, res);
});
app.get("/about", async (req, res, next) => {
  res.render("about", { imgUsername: req.cookies.username });
});

app.post("/skill", async (req, res, next) => {
  let headers = [
    "rollNumber",
    "hackerRankScore",
    "codeChefScore",
    "codeForcesScore",
    "interviewBitScore",
    "spojScore",
    "geeksForGeeksScore",
    "leetCodeScore",
    "buildIT",
    "overallScore",
  ];

  let options = {
    url: serverRoute + "/skillUps",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, async (err, response, body) => {
    let toppers = [
      body[0]["rollNumber"],
      body[1]["rollNumber"],
      body[2]["rollNumber"],
    ];
    toppers[0] = toppers[0].toUpperCase();
    toppers[1] = toppers[1].toUpperCase();
    toppers[2] = toppers[2].toUpperCase();
    const [firstResponse, secondResponse, thirdResponse] = await Promise.all([
      fetch(`${serverRoute}/users/branch/${toppers[0]}`),
      fetch(`${serverRoute}/users/branch/${toppers[1]}`),
      fetch(`${serverRoute}/users/branch/${toppers[2]}`),
    ]);

    const first = await firstResponse.json();
    const second = await secondResponse.json();
    const third = await thirdResponse.json();

    const topperData = [first, second, third];

    body.clientAddress = clientRoute;
    res.render("leaderboard", {
      imgUsername: req.cookies.username,
      data: body,
      headers: headers,
      toppers: topperData,
    });
  });
});

app.get("/SkillRegister", checkSignIn, async (req, res) => {
  let options = {
    url: serverRoute + "/skillUp",
    method: "get",
    body: {
      rollNumber: req.cookies.username,
    },
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    res.render("skillUpForm", {
      data: body.data,
      imgUsername: req.cookies.username,
      token: req.cookies.token,
    });
  });
});

app.post("/SkillRegister", async (req, res) => {
  let options = {
    body: req.body,
    url: serverRoute + "/skillUp",
    method: "post",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    if (body.success) {
      res.render("error", { data: body, imgUsername: req.cookies.username });
    } else {
      res.render("error", {
        data: { message: "Your SkillUp has been Registered" },
        imgUsername: req.cookies.username,
      });
    }
  });
});

app.get("/admin/add/skillup", async (req, res) => {
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

app.get("/admin/add/event", async (req, res) => {
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
    if (
      body.success ||
      req.cookies.username === "21951A05Z9" ||
      req.cookies.username === "19951A0535"
    ) {
      res.render("codechefForm", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/addUser", async (req, res) => {
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
      res.render("createNewUser", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/profile", checkSignIn, async (req, res, next) => {
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
    let options = {
      url: serverRoute + "/tparticipations/findUserCourses",
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      body: {
        username: req.cookies.username.toLowerCase(),
      },
      json: true,
    };
    request(options, function (err, response, body2) {
      let partCount = [];
      if (body2.success) {
        partCount = body2.data;
      }
      let options = {
        url: serverRoute + "/questions/courses/" + "IARE_PY",
        method: "get",
        headers: {
          authorization: req.cookies.token,
        },
        json: true,
      };
      // Get questions for contest
      request(options, function (err, response, body3) {
        let options3 = {
          url: serverRoute + "/tparticipations/" + "IARE_PY",
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
          if (bodytimer) {
            for (let i = 0; i < body3.length; i++) {
              if (body3[i].difficulty === "level_0") {
                eCount++;
              } else if (body3[i].difficulty === "level_1") {
                mCount++;
              } else if (body3[i].difficulty === "level_2") {
                hCount++;
              } else if (body3[i].difficulty === "contest") {
                cCount++;
              }
            }

            totalSolEasy = bodytimer.easySolved.length;
            totalSolMedium = bodytimer.mediumSolved.length;
            totalSolHard = bodytimer.hardSolved.length;
            totalSolContest = bodytimer.contestSolved.length;
            req.params.courseId = req.params.courseId;
          } else {
            eCount = 1;
            mCount = 1;
            hCount = 1;
            cCount = 1;
          }
          body3.easyPercentage = Math.ceil((totalSolEasy / eCount) * 100);
          body3.mediumPercentage = Math.ceil((totalSolMedium / mCount) * 100);
          body3.hardPercentage = Math.ceil((totalSolHard / hCount) * 100);
          body3.contestPercentage = Math.ceil((totalSolContest / cCount) * 100);

          let options = {
            url: serverRoute + "/findAllContestsUser",
            method: "get",
            headers: {
              authorization: req.cookies.token,
            },
            body: {
              username: req.cookies.username.toLowerCase(),
            },
            json: true,
          };

          request(options, function (err, response, body4) {
            let options = {
              url:
                serverRoute + "/resume/" + req.cookies.username.toLowerCase(),
              method: "get",
              headers: {
                authorization: req.cookies.token,
              },
              json: true,
            };
            request(options, function (err, response, body5) {
              let options = {
                url: serverRoute + "/skillUp",
                method: "get",
                headers: {
                  authorization: req.cookies.token,
                },
                body: {
                  rollNumber: req.cookies.username.toUpperCase(),
                },
                json: true,
              };
              request(options, function (err, response, body6) {
                urlExists(testUrl, function (err, exists) {
                  if (exists) {
                    body.imgUrl = testUrl;
                    body.serverUrl = serverRoute;
                    res.render("editProfile", {
                      data: body,
                      imgUsername: req.cookies.username,
                      partCount: partCount,
                      progress: body3,
                      contestCount: body4.count,
                      resumeStatus: body5.success,
                      skillups: body6,
                      token: req.cookies.token,
                      serverUrl: serverRoute,
                    });
                  } else {
                    body.imgUrl = "./images/defaultuser.png";
                    body.serverUrl = serverRoute;
                    res.render("editProfile", {
                      data: body,
                      imgUsername: req.cookies.username,
                      partCount: partCount,
                      progress: body3,
                      contestCount: body4.count,
                      resumeStatus: body5.success,
                      token: req.cookies.token,
                      serverUrl: serverRoute,
                      skillups: body6,
                    });
                  }
                });
              });
            });
          });
        });
      });
    });
  });
});

app.post("/editProfile", async (req, res) => {
  let options = {
    body: {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.pswd,
      newPassword: req.body.pswd1 === "" ? req.body.pswd : req.body.pswd1,
    },
    url: serverRoute + "/users/" + req.cookies.username.toLowerCase(),
    method: "post",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    if (body.success) {
      res.redirect("/profile");
    } else {
      res.render("error", {
        data: body,
        imgUsername: req.cookies.username,
        token: req.cookies.token,
        serverUrl: serverRoute,
      });
    }
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

app.get("/admin/add/practiceQuestion", async (req, res) => {
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
      res.render("practiceQuestionAdd", {
        data: url,
        token: req.cookies.token,
      });
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

app.get("/admin/add/mcq", async (req, res) => {
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
      res.render("newmcqadd", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/edit/mcq", async (req, res) => {
  let body = {
    posturl: clientRoute + "/mcqEdit",
    url: clientRoute,
    method: "POST",
    class: "btn-green",
    title: "Editing",
  };

  res.render("search", { data: body });
});

app.post("/mcqEdit", async (req, res) => {
  let questionId = req.body.questionId;
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
      let options = {
        url: serverRoute + "/mcq/" + questionId,
        method: "get",
        headers: {
          authorization: req.cookies.token,
        },
        json: true,
      };

      request(options, function (err, response, body) {
        body[0].serverurl = serverRoute;
        res.render("mcqedit", { data: body[0], token: req.cookies.token });
      });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/delete/mcq", async (req, res) => {
  let options = {
    url: serverRoute + "/mcqs",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    body.posturl = clientRoute + "/mcqDelete";
    body.url = clientRoute;
    body.method = "POST";
    body.class = "btn-danger";
    body.title = "Delete";
    body.subtitle = "MCQ's";
    res.render("dropdown", { data: body });
  });
});

app.post("/mcqDelete", async (req, res) => {
  let options = {
    url: serverRoute + "/mcq/" + req.body.questionId,
    method: "delete",
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
    res.redirect("/admin/delete/mcq");
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

app.get("/admin/add/sets", async (req, res) => {
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
      res.render("sets", { data: url, token: req.cookies.token });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/add/set", async (req, res) => {
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
      res.render("sets2", { data: url, token: req.cookies.token });
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

app.get("/admin/add/qualifier_test", async (req, res) => {
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
      res.render("qualifier_test_add", { data: url, token: req.cookies.token });
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

app.get("/admin/edit/question", async (req, res) => {
  let options = {
    url: serverRoute + "/questions",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    body.posturl = clientRoute + "/questionEdit";
    body.url = clientRoute;
    body.method = "POST";
    body.class = "btn-green";
    body.title = "Editing";
    body.subtitle = "Questions";
    body.username = req.cookies.username;
    res.render("search", { data: body });
  });
});
app.get("/admin/edit/contest", async (req, res) => {
  let options = {
    url: serverRoute + "/contests",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    body.posturl = clientRoute + "/contestEdit";
    body.url = clientRoute;
    body.method = "POST";
    body.class = "btn-green";
    body.title = "Editing";
    body.subtitle = "Contests";
    body.username = req.cookies.username;
    res.render("search", { data: body });
  });
});

app.post("/questionEdit", async (req, res) => {
  let questionId = req.body.questionId;
  let options = {
    url: serverRoute + "/isAdmin",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    let user = req.cookies.username;
    let userArr = [
      "19951A0579",
      "19951A12B5",
      "19951A05M7",
      "19951A1273",
      "18951A05A3",
      "18951A1228",
      "18951A04H3",
      "19951A1268",
      "18951A0478",
      "18951A0432",
      "18951A1232",
      "18951A0571",
      "19951A0545",
      "19951A05K5",
    ];
    if (body.success || userArr.includes(user)) {
      let options = {
        url: serverRoute + "/questions/" + questionId,
        method: "get",
        headers: {
          authorization: req.cookies.token,
        },
        json: true,
      };

      request(options, function (err, response, body) {
        if (!("success" in body)) {
          body[0].serverurl = serverRoute;
          res.render("questionedit", {
            data: body[0],
            token: req.cookies.token,
          });
        } else {
          body.message = "Unauthorized access";
          res.render("error", {
            data: body,
            imgUsername: req.cookies.username,
          });
        }
      });
    } else {
      body.message = "Unauthorized access";
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});
app.post("/contestEdit", async (req, res) => {
  let contestId = req.body.questionId;
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
      let options = {
        url: serverRoute + "/contests/" + contestId,
        method: "get",
        headers: {
          authorization: req.cookies.token,
        },
        json: true,
      };

      request(options, function (err, response, body) {
        if (!("success" in body)) {
          body[0].serverurl = serverRoute;
          res.render("contestupdate", {
            data: body[0],
            token: req.cookies.token,
          });
        } else {
          body.message = "Unauthorized access";
          res.render("error", {
            data: body,
            imgUsername: req.cookies.username,
          });
        }
      });
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
    body.posturl = clientRoute + "/questionDelete";
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
    method: "delete",
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

app.get("/admin/deletequestions/multiple", async (req, res) => {
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
    res.render("deleteMultipleQuestions", {
      data: url,
      token: req.cookies.token,
    });
  });
});

app.post("/admin/deletequestions/multiple", async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute,
  };

  let options = {
    url: serverRoute + "/deletequestions/multiple/" + req.body.questionIds,
    method: "post",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    if (!body.hasOwnProperty("success")) {
      res.render("deleteMultipleQuestions", {
        data: url,
        token: req.cookies.token,
      });
    } else {
      res.send("Error Encountered!");
    }
  });
});

app.get("/admin/contentDevProgress", async (req, res) => {
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
    res.render("contentDevProgress", {
      data: url,
      data2: [],
      token: req.cookies.token,
    });
  });
});

app.post("/admin/contentDevProgress/", async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute,
  };

  let options = {
    url:
      serverRoute + "/tparticipations/contentDevProgress/" + req.body.username,
    method: "post",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    if (!body.hasOwnProperty("success")) {
      res.render("contentDevProgress", {
        data: url,
        data2: body,
        token: req.cookies.token,
      });
    } else {
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/admin/unverifiedusers", async (req, res) => {
  let options = {
    url: serverRoute + "/admin/users",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    var unverified_users = [];
    for (let i = 0; i < body.length; i++) {
      if (!body[i].isVerified && !body[i].admin) {
        body[i].color = "pink";
        unverified_users.push(body[i]);
      }
    }
    unverified_users.url = clientRoute;
    unverified_users.serverurl = serverRoute;
    res.render("unverifiedusers", {
      data: unverified_users,
      token: req.cookies.token,
    });
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
app.get("/admin/qualResults", async (req, res) => {
  let options = {
    url: serverRoute + "/qualContests",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    body.posturl = clientRoute + "/admin/results/qualContest";
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
    console.log(bodyparticipation);
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

app.post("/admin/results/qualContest", async (req, res) => {
  let options = {
    url: serverRoute + "/mcqParticipations/all",
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
      url: serverRoute + "/mcqs/contests/" + req.body.contestId,
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
      res.render("qualResults", {
        data: url,
        datap: bodyparticipation,
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

app.get(
  "/contests/:contestId/leaderboard",
  checkSignIn,
  async (req, res, next) => {
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
  }
);

app.get("/admin", checkSignIn, async (req, res, next) => {
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

app.get("/ide/:questionId", checkSignIn, async (req, res, next) => {
  let questionId = req.params.questionId;
  res.sendFile(path.resolve("../IDE/index.html"));
});

app.get("/contest", checkSignIn, async (req, res, next) => {
  let options = {
    url: serverRoute + "/contests/user/" + req.cookies.username.toLowerCase(),
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    body: {
      mcq: false,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    res.clearCookie("courseId");
    res.render("contest", { imgUsername: req.cookies.username, data: body });
  });
});

app.get("/contestPassword/:contestId", checkSignIn, async (req, res) => {
  res.render("contestPassword", {
    imgUsername: req.cookies.username,
    contestId: req.params.contestId,
    token: req.cookies.token,
  });
});

app.post("/checkContestPassword", checkSignIn, async (req, res) => {
  req.body.rollNumber = req.cookies.username;
  let options = {
    url: serverRoute + "/checkContestPassword",
    method: "post",
    headers: {
      authorization: req.cookies.token,
    },
    body: req.body,
    json: true,
  };
  request(options, function (err, response, body) {
    if (body.success) {
      a = "/contests/" + body.contestId;
      res.redirect(a);
    } else {
      res.redirect("/contest");
    }
  });
});

app.get("/contests/:contestId", checkSignIn, async (req, res, next) => {
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
          branch: req.cookies.branch ? req.cookies.branch : "",
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
            imageUrl = imageRetrive(req, res);
            body.contestId = req.params.contestId;
            res.render("questions", {
              imgUsername: req.cookies.username,
              data: body,
              datatimer: bodytimer,
              imgUrl: imageUrl,
              serverUrl: serverRoute,
              token: req.cookies.token,
            });
          });
        });
      });
    } else {
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.get("/extendUserTime", async (req, res) => {
  let data = {
    url: clientRoute,
    serverurl: serverRoute,
  };
  res.render("changeValidTill", { data, token: req.cookies.token });
});

app.post("/endContest/:contestId", async (req, res) => {
  let options = {
    url: serverRoute + "/endContest",
    method: "post",
    headers: {
      authorization: req.cookies.token,
    },
    body: {
      contestId: req.params.contestId,
      username: req.cookies.username,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    res.redirect("/contest");
  });
});

app.get("/qualifier_tests", checkSignIn, async (req, res, next) => {
  let options = {
    url: serverRoute + "/contests",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    body: {
      mcq: true,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    res.clearCookie("courseId");
    res.render("qualifier_test", {
      imgUsername: req.cookies.username,
      data: body,
    });
  });
});

app.get("/qualifier_test/:contestId", checkSignIn, async (req, res, next) => {
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
  // Check if contest is open
  request(options, function (err, response, body) {
    if (body.success) {
      let options1 = {
        url: serverRoute + "/mcqParticipations", // MCQ participation
        method: "post",
        headers: {
          authorization: req.cookies.token,
        },
        body: {
          contestId: req.params.contestId,
        },
        json: true,
      };
      // Add participation
      request(options1, function (err, response, body) {
        let option2 = {
          url: serverRoute + "/mcqFirst/" + req.params.contestId, // First MCQ
          method: "get",
          headers: {
            authorization: req.cookies.token,
          },
          json: true,
        };
        // Get mcq for contest
        request(option2, function (err, response, body) {
          if (!body.message) {
            res.cookie("contestId", req.params.contestId);
            let options3 = {
              url: serverRoute + "/mcqParticipations/" + req.params.contestId, // Time and score
              method: "get",
              headers: {
                authorization: req.cookies.token,
              },
              json: true,
            };
            // Get participation details
            request(options3, function (err, response, bodytimer) {
              if (Array.isArray(bodytimer)) {
                bodytimer = bodytimer[0];
                bodytimer.responses =
                  bodytimer.responses[body.section - 1].responses;

                let currSection = bodytimer.responses;
                currSection = currSection.map((v) => v.questionNum);
                let index = currSection.indexOf(body.questionNum);
                if (index !== -1) currSection.splice(index, 1);

                bodytimer.selection =
                  index === -1 ? 0 : bodytimer.responses[index].selection;
                bodytimer.questionNums = currSection;
                bodytimer.submissionResults = null;
                bodytimer.responses = null;

                // bodytimer.open = bodytimer.validTill>currentDatenTime;
                res.render("mcqs", {
                  imgUsername: req.cookies.username,
                  imgBranch: req.cookies.branch,
                  data: body,
                  datatimer: bodytimer,
                });
              } else {
                res.render("error", {
                  data: body,
                  imgUsername: req.cookies.username,
                });
              }
            });
          } else {
            res.render("error", {
              data: body,
              imgUsername: req.cookies.username,
            });
          }
        });
      });
    } else {
      res.render("error", { data: body, imgUsername: req.cookies.username });
    }
  });
});

app.post(
  "/qualifier_test/:contestId/mcq",
  checkSignIn,
  async (req, res, next) => {
    const doRequest = () => {
      return new Promise(() => {
        let section = Number(req.body.section);
        let sectionLen = Number(req.body.sectionLen);
        let questionNum = Number(req.body.questionNum);
        let sectionCount = Number(req.body.sectionCount);
        let secName = req.body.sectionName;
        let secarray = req.body.secarr.split(",");

        if (questionNum === sectionLen) {
          if (section === sectionCount) questionNum -= 1;
          else {
            questionNum = 0;
            section += 1;
            secName = secarray[section - 1];
          }
        }
        let options = {
          url:
            serverRoute +
            "/mcqs/" +
            req.params.contestId +
            "/" +
            section +
            "/" +
            questionNum,
          method: "post",
          body: { sectionName: secName },
          headers: {
            authorization: req.cookies.token,
          },
          json: true,
        };
        // get one MCQ
        request(options, (err, response, body) => {
          if (!body.message) {
            res.cookie("contestId", req.params.contestId);
            let options3 = {
              url: serverRoute + "/mcqParticipations/" + req.params.contestId,
              method: "get",
              headers: {
                authorization: req.cookies.token,
              },
              json: true,
            };
            // get participation details
            request(options3, (err, response, bodytimer) => {
              if (Array.isArray(bodytimer)) {
                bodytimer = bodytimer[0];

                let currSection = [];
                let selection = 0;
                let index = 0;
                if (
                  bodytimer.sections[body.section - 1].toUpperCase() != "CODING"
                ) {
                  bodytimer.responses =
                    bodytimer.responses[body.section - 1].responses;
                  currSection = bodytimer.responses;
                  currSection = currSection.map((v) => v.questionNum);
                  index = currSection.indexOf(body.questionNum);
                  if (index !== -1) {
                    currSection.splice(index, 1);
                    selection = bodytimer.responses[index].selection;
                  }
                }
                bodytimer.selection = selection;
                bodytimer.questionNums = currSection;
                bodytimer.submissionResults = null;
                bodytimer.responses = null;

                res.render("mcqs", {
                  imgUsername: req.cookies.username,
                  imgBranch: req.cookies.branch,
                  data: body,
                  datatimer: bodytimer,
                });
              } else {
                res.render("error", {
                  data: body,
                  imgUsername: req.cookies.username,
                });
              }
            });
          } else {
            res.render("error", {
              data: body,
              imgUsername: req.cookies.username,
            });
          }
        });
      });
    };

    const addSelection = () => {
      return new Promise(() => {
        let options = {
          url: serverRoute + "/validateMcq",
          method: "post",
          body: {
            mcqId: req.body.mcqId,
            answer: req.body.answer,
            section: req.body.section,
            contestId: req.params.contestId,
            questionNum: req.body.questionNum,
          },
          headers: {
            authorization: req.cookies.token,
          },
          json: true,
        };
        request(options, async (error, response, body) => {
          if (!body.message) {
            const second = await doRequest();
          } else {
            res.render("error", {
              data: body,
              imgUsername: req.cookies.username,
            });
          }
        });
      });
    };

    // check whether retrieve or update and retrieve
    if (req.body.answer) {
      const first = await addSelection();
    } else {
      const first = await doRequest();
    }
  }
);

app.get(
  "/qualifierTestScore/:contestId",
  checkSignIn,
  async (req, res, next) => {
    let options = {
      url: serverRoute + "/generate_score/" + req.params.contestId,
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };

    request(options, (err, response, body) => {
      if (!body.message) {
        let noOfSections = body.sections.length;
        body.contestId = req.params.contestId;

        /*
      body.answers = Array.prototype.concat.apply([], body.answerKey);
      body.alphabet = ["", "A", "B", "C", "D"];
      */

        res.render("score", {
          imgUsername: req.cookies.username,
          imgBranch: req.cookies.branch,
          data: body,
        });
      } else {
        res.render("error", {
          data: body,
          imgUsername: req.cookies.username,
        });
      }
    });
  }
);

app.get("/qualifier_tests/leaderboard/:contestId", async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute,
  };
  let options = {
    url: serverRoute + "/participations/leaderboard/" + req.params.contestId,
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, (err, response, body) => {
    if (!body.message) {
      url.contestId = req.params.contestId;
      res.render("leaderboard2", {
        imgUsername: req.cookies.username,
        imgBranch: req.cookies.branch,
        data: body,
        url,
      });
    } else {
      res.render("error", {
        data: body,
        imgUsername: req.cookies.username,
      });
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

      try {
        let userCookie;
        let ind = userSessions.findIndex((e) => e.username === body.username);
        if (ind > -1) {
          let val = userSessions[ind].val;
          userSessions[ind].val = ++val;
          userCookie = body.username + val.toString();
          userSessions2[ind] = userCookie;
        } else {
          userSessions.push({
            username: body.username,
            val: 1,
          });
          userCookie = body.username + "1";
          userSessions2.push(userCookie);
        }
        res.cookie("user", userCookie);

        fs.writeFile("./store.txt", userSessions2.join("\n"), (err) => {
          if (err) return res.redirect("/logout");
        });
      } catch (err) {
        userSessions = [];
        userSessions2 = [];
        unlink("./store.txt", (err) => {
          if (err) console.log("error: delete file");
        });
        console.log("error occurred");
        return res.redirect("/logout");
      }

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
  /*
  try{
    let ind = userSessions.findIndex(e => e.username === req.cookie.username);
    let ind2 = userSessions2.indexOf(req.cookie.user);
    userSessions.split(ind, 1);
    userSessions2.split(ind2, 1);
  } catch(err){
    console.log("some error");
  }
  */
  res.clearCookie("token");
  res.clearCookie("username");
  res.clearCookie("contestId");
  res.clearCookie("courseId");
  res.clearCookie("branch");
  res.clearCookie("user");
  res.redirect("/");
});

app.get("/pdf/:setNo", async (req, res) => {
  res.redirect(serverRoute + "/pdf/" + req.params.setNo);
});

app.get("/error", async (req, res) => {
  res.render("error", { data: req.query, imgUsername: req.cookies.username });
});

app.get(
  "/contests/questions/:questionId",
  checkSignIn,
  async (req, res, next) => {
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
  }
);

app.get(
  "/tutorials/questions/:questionId",
  checkSignIn,
  async (req, res, next) => {
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
      body.serverUrl = serverRoute;
      let options = {
        url: serverRoute + "/discussions/" + req.params.questionId,
        method: "get",
        headers: {
          authorization: req.cookies.token,
        },
        json: true,
      };
      request(options, function (err, response, body1) {
        res.render("questionTutDesc", {
          imgUsername: req.cookies.username,
          data: body,
          token: req.cookies.token,
          messages: body1,
        });
      });
    });
  }
);

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

app.get("/tutorials", checkSignIn, async (req, res, next) => {
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

app.get(
  "/tutorials/:courseId/progress",
  checkSignIn,
  async (req, res, next) => {
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
  }
);

app.get(
  "/tutorials/:courseId/:difficulty/:concept",
  checkSignIn,
  async (req, res, next) => {
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
  }
);

app.get(
  "/tutorials/:courseId/:difficulty",
  checkSignIn,
  async (req, res, next) => {
    let difficulty = req.params.difficulty;
    let categoryBased = difficulty.includes("-");
    let ifTopicsOrCompanies =
      req.params.difficulty === "Topics" ||
      req.params.difficulty === "Companies";

    let param = ifTopicsOrCompanies
      ? "topics"
      : categoryBased
      ? difficulty.split("-").join("/")
      : difficulty;

    let options = {
      url:
        serverRoute +
        "/questions/" +
        (categoryBased ? "practice/" : "courses/") +
        req.params.courseId +
        "/" +
        param,
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };

    request(options, function (err, response, body) {
      if (ifTopicsOrCompanies) {
        let courseIds = ["IARE_PY", "IARE_C", "IARE_JAVA", "IARE_CPP"];
        let isCourseValid = courseIds.includes(req.params.courseId);
        let ifTopics = difficulty === "Topics";

        body.courseId = req.params.courseId;
        body.courseName = isCourseValid
          ? ifTopics
            ? "Select a topic"
            : "Select a company"
          : "Invalid Course";

        res.render("practiceTutList", {
          imgUsername: req.cookies.username,
          title: difficulty,
          data: body,
        });
      } else {
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
            if (
              bodytimer.submissionResults.indexOf(body[i].questionId) !== -1
            ) {
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
      }
    });
  }
);

app.get("/tutorials/:courseId", checkSignIn, async (req, res, next) => {
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

app.get("/certificate", async (req, res) => {
  let options = {
    url: serverRoute + "/users/" + req.cookies.username.toLowerCase(),
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, function (err, response, body) {
    let options = {
      url: serverRoute + "/skills/" + req.cookies.username,
      method: "get",
      headers: {
        authorization: req.cookies.token,
      },
      json: true,
    };

    request(options, (err, response, body2) => {
      if (!body2.message) {
        res.render("certificate", {
          imgUsername: req.cookies.username,
          imgBranch: req.cookies.branch,
          data: body2,
          name: body.name,
        });
      } else {
        res.render("error", {
          data: body2,
          imgUsername: body.name,
        });
      }
    });
  });
});

app.get("/codechef-iare-chapter", async (req, res, next) => {
  let options = {
    url: serverRoute + "/codechef-events/",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, (err, response, body) => {
    if (!body.message) {
      res.render("iare_chapter", { data: body });
    } else {
      res.render("error", {
        data: body,
      });
    }
  });
});

app.get("/userSession/:sessionId", (req, res) => {
  if (userSessions2.includes(req.params.sessionId))
    res.status(200).send({ status: true });
  else res.status(404).send({ status: false, message: "user logged out!" });
});
app.get("/resume", checkSignIn, async (req, res) => {
  let options = {
    url: serverRoute + "/resume/" + req.cookies.username,
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, (err, response, body) => {
    res.render("ResumeBuilderForm", {
      url: serverRoute,
      imgUsername: req.cookies.username,
      token: req.cookies.token,
      curl: clientRoute,
      data: body.data,
    });
  });
});
app.post("/resume/:username", async (req, res) => {
  let options = {
    url: serverRoute + "/resume/" + req.params.username,
    method: "delete",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    let options = {
      url: serverRoute + "/resumes",
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
        body[i].firstName = body[i].personalInfo.firstName;
        body[i].lastName = body[i].personalInfo.lastName;
        var branch = body[i].resumeId.substring(6, 8);
        if (branch == "05") {
          body[i].branch = "CSE";
        } else if (branch == "12") {
          body[i].branch = "IT";
        } else if (branch == "04") {
          body[i].branch = "ECE";
        } else if (branch == "01") {
          body[i].branch = "CIV";
        } else if (branch == "02") {
          body[i].branch = "EEE";
        } else if (branch == "03") {
          body[i].branch = "ME";
        } else if (branch == "21") {
          body[i].branch = "CSE";
        } else if (branch == "66") {
          body[i].branch = "CSE AIML";
        } else if (branch == "67") {
          body[i].branch = "CSE DS";
        } else if (branch == "62") {
          body[i].branch = "CSE CS";
        } else if (branch == "33") {
          body[i].branch = "CSE IT";
        } else {
          body[i].branch = "INVALID";
        }
      }
      res.render("viewResumes", { data: body });
    });
  });
});
app.get("/resume/:username", checkSignIn, async (req, res) => {
  let options = {
    url: serverRoute + "/resume/" + req.params.username,
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };

  request(options, (err, response, body) => {
    if (body) {
      a = body.data.themeId;
      res.render("ResumeTemplates/" + a, { data: body.data });
    } else {
      res.render("error", {
        imgUsername: req.cookies.username,
        data: { message: "You have no resumes" },
      });
    }
  });
});

app.get("/admin/viewResumes", async (req, res) => {
  let options = {
    url: serverRoute + "/resumes",
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
      body[i].firstName = body[i].personalInfo.firstName;
      body[i].lastName = body[i].personalInfo.lastName;
      var branch = body[i].resumeId.substring(6, 8);
      if (branch == "05") {
        body[i].branch = "CSE";
      } else if (branch == "12") {
        body[i].branch = "IT";
      } else if (branch == "04") {
        body[i].branch = "ECE";
      } else if (branch == "01") {
        body[i].branch = "CIV";
      } else if (branch == "02") {
        body[i].branch = "EEE";
      } else if (branch == "03") {
        body[i].branch = "ME";
      } else if (branch == "21") {
        body[i].branch = "CSE";
      } else if (branch == "66") {
        body[i].branch = "CSE AIML";
      } else if (branch == "67") {
        body[i].branch = "CSE DS";
      } else if (branch == "62") {
        body[i].branch = "CSE CS";
      } else if (branch == "33") {
        body[i].branch = "CSE IT";
      } else {
        body[i].branch = "INVALID";
      }
    }
    res.render("viewResumes", { data: body });
  });
});

app.post("/getAllResumes", async (req, res) => {
  let options = {
    url: serverRoute + "/getAllResumes",
    body: {
      year: req.body.Year,
      branch: req.body.Branch,
    },
    method: "post",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, function (err, response, body) {
    res.render("allResumes", { resumes: body });
  });
});

app.get("/MyResume", checkSignIn, async (req, res) => {
  let options = {
    url: serverRoute + "/facultyResume/" + req.cookies.username,
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, (err, response, body) => {
    if (body) {
      res.render("ResumeTemplates/facultyTheme", {
        imgUsername: req.cookies.username,
        data: body,
      });
    }
  });
});

app.get("/facultyResume", checkSignIn, async (req, res) => {
  let options = {
    url: serverRoute + "/facultyResume/" + req.cookies.username,
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    json: true,
  };
  request(options, (err, response, body) => {
    res.render("facultyResume", {
      url: serverRoute,
      imgUsername: req.cookies.username,
      token: req.cookies.token,
      curl: clientRoute,
      data: body,
    });
  });
});

app.get("/ResumeBuilder", checkSignIn, async (req, res) => {
  if (req.cookies.token) {
    res.render("ResumeHome", { clientURL: clientRoute });
  } else {
    res.render("error", { data: "Unauthorized Access", imgUsername: null });
  }
});

app.get("/potdReport", checkSignIn, async (req, res) => {
  res.render("potdReport", { imgUsername: req.cookies.username });
});

app.get("/skillCertificate", checkSignIn, async (req, res) => {
  let options = {
    url: serverRoute + "/skillUp",
    method: "get",
    headers: {
      authorization: req.cookies.token,
    },
    body: {
      rollNumber: req.cookies.username.toUpperCase(),
    },
    json: true,
  };
  request(options, (err, response, body) => {
    if (body.success) {
      let skillup = body.data;
      let options = {
        url: serverRoute + "/users/" + req.cookies.username.toLowerCase(),
        method: "get",
        headers: {
          authorization: req.cookies.token,
        },
        json: true,
      };
      request(options, (err, response, body) => {
        let name = body.name;
        res.render("skillCertificate", { skillup, name });
      });
    } else {
      res.render("error", {
        data: { message: "Your SkillUp has not been Registered" },
        imgUsername: req.cookies.username,
      });
    }
  });
});

app.get("*", async (req, res) => {
  res.render("404page");
});

app.listen(4000);
console.log("Server @ port 4000");
