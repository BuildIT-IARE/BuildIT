const SkillUp = require("../models/skillUp.model.js");
const Participation = require("../models/participationTut.model.js");
// const WeekSkill = require("../models/weekSkill.model.js");
const inarray = require("inarray");
// const xlsx = require("xlsx");
const fs = require("fs");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request = require("request");
const fetch = require("node-fetch");

exports.create = (req, res) => {
  var leetCodeScore = 0;
  var options = {
    url: "https://leetcode.com/graphql",
    method: "post",
    body: {
      operationName: "getUserProfile",
      variables: {
        username: req.body.leetCodeId,
      },
      query:
        "query getUserProfile($username: String!) {  allQuestionsCount {    difficulty    count  }  matchedUser(username: $username) {    contributions {    points      questionCount      testcaseCount    }    profile {    reputation      ranking    }    submitStats {      acSubmissionNum {        difficulty        count        submissions      }      totalSubmissionNum {        difficulty        count        submissions      }    }  }}",
    },
    headers: {
      referer: "https://leetcode.com/" + req.body.leetCodeId + "/",
    },
    json: true,
  };
  const calcScore = async () => {
    try {
      const score = await Promise.all([
        //codeChef
        got("https://www.codechef.com/users/" + req.body.codeChefId)
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll("h5")[0].textContent;
            a = a.split("(");
            a = a[1];
            a = a.split(")");
            a = a[0];
            a = Number(a);
            return a * 10;
          })
          .catch((err) => {
            return -1;
          }),
        //interviewBit
        got("https://www.interviewbit.com/profile/" + req.body.interviewBitId)
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll(".txt")[1];
            a = a.textContent;
            a = Number(a);
            return a;
          })
          .catch((err) => {
            return -1;
          }),
        got(
          "https://www.hackerrank.com/leaderboard?filter=" +
            req.body.hackerRankId +
            "&filter_on=hacker&page=1&track=algorithms&type=practice"
        )
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll(".score")[1].textContent;
            a = Number(a);
            return a;
          })
          .catch((err) => {
            return -1;
          }),
        got(
          "https://www.hackerrank.com/leaderboard?filter=" +
            req.body.hackerRankId +
            "&filter_on=hacker&page=1&track=data-structures&type=practice"
        )
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll(".score")[1].textContent;
            a = Number(a);
            return a;
          })
          .catch((err) => {
            return -1;
          }),
        got("https://www.spoj.com/users/" + req.body.spojId)
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll("dd")[0].textContent;
            a = Number(a);
            return a * 10;
          })
          .catch((err) => {
            return -1;
          }),
        got(
          "https://auth.geeksforgeeks.org/user/" +
            req.body.geeksForGeeksId +
            "/practice"
        )
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll("span")[13].textContent;
            a = a.split(":");
            a = Number(a[1]);
            return a;
          })
          .catch((err) => {
            return -1;
          }),
        got("https://codeforces.com/profile/" + req.body.codeForcesId + "")
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll(
              "._UserActivityFrame_counterValue"
            )[0];
            a = a.textContent;
            a = a.split(" ");
            a = Number(a[0]);
            return a * 10;
          })
          .catch((err) => {
            return NaN;
          }),
        Participation.find({ username: req.body.rollNumber.toLowerCase() })
          .then((participation) => {
            var total = [];
            for (var i = 0; i < participation.length; i++) {
              total = total.concat(participation[i]["submissionResults"]);
            }
            var totalSet = new Set(total);
            console.log(totalSet.size * 10);
            buildIt = Number(totalSet.size) * 10;
            return buildIt;
          })
          .catch((err) => {
            return NaN;
          }),
      ]);
      request(options, async function (err, response, body) {
        var leetScore;
        try {
          leetScore = body.data.matchedUser.submitStats.acSubmissionNum;
        } catch {
          leetScore = [-1, -1, -1, -1];
        }
        leetCodeScore = Number(
          leetScore[1].count * 5 +
            leetScore[2].count * 10 +
            leetScore[3].count * 15
        );
        SkillUp.findOneAndUpdate(
          { rollNumber: req.body.rollNumber },
          {
            $set: {
              rollNumber: req.body.rollNumber,
              leetCodeId: req.body.leetCodeId,
              leetCodeScore: leetCodeScore,
              hackerRankId: req.body.hackerRankId,
              hackerRankScore: score[2] + score[3],
              codeChefId: req.body.codeChefId,
              codeChefScore: score[0],
              codeForcesId: req.body.codeForcesId,
              codeForcesScore: score[6],
              interviewBitId: req.body.interviewBitId,
              interviewBitScore: score[1],
              spojId: req.body.spojId,
              spojScore: score[4],
              geeksForGeeksId: req.body.geeksForGeeksId,
              geeksForGeeksScore: score[5],
              buildIT: score[7],
              overallScore: Math.round(
                score.reduce((a, b) => a + b, 0) + leetCodeScore
              ),
            },
          }
        )
          .then((skillUp) => {
            if (skillUp === null) {
              const skillUp = new SkillUp({
                rollNumber: req.body.rollNumber,
                leetCodeId: req.body.leetCodeId,
                leetCodeScore: leetCodeScore,
                hackerRankId: req.body.hackerRankId,
                hackerRankScore: score[2] + score[3],
                codeChefId: req.body.codeChefId,
                codeChefScore: score[0],
                codeForcesId: req.body.codeForcesId,
                codeForcesScore: score[6],
                interviewBitId: req.body.interviewBitId,
                interviewBitScore: score[1],
                spojId: req.body.spojId,
                spojScore: score[4],
                geeksForGeeksId: req.body.geeksForGeeksId,
                geeksForGeeksScore: score[5],
                buildIT: score[7],
                overallScore: Math.round(
                  score.reduce((a, b) => a + b, 0) + leetCodeScore
                ),
              });
              skillUp
                .save()
                .then((data) => {
                  res.send(data);
                })
                .catch((err) => {
                  res.send({
                    success: false,
                    message:
                      "Some error occurred while creating the skillUp Profile.",
                  });
                });
            } else {
              res.send({
                success: true,
                message: "SkillUp Details Updated",
              });
            }
          })
          .catch((err) => {
            res.send({
              success: false,
              message:
                "Some error occurred while creating the skillUp Profile.",
            });
          });
      });
    } catch {
      res.send({
        success: false,
        message: "Some error occurred while creating the skillUp Profile.",
      });
    }
  };
  calcScore();
};

exports.update = (req, res) => {
  req.body = req;
  var leetCodeScore = 0;
  var options = {
    url: "https://leetcode.com/graphql",
    method: "post",
    body: {
      operationName: "getUserProfile",
      variables: {
        username: req.body.leetCodeId,
      },
      query:
        "query getUserProfile($username: String!) {  allQuestionsCount {    difficulty    count  }  matchedUser(username: $username) {    contributions {    points      questionCount      testcaseCount    }    profile {    reputation      ranking    }    submitStats {      acSubmissionNum {        difficulty        count        submissions      }      totalSubmissionNum {        difficulty        count        submissions      }    }  }}",
    },
    headers: {
      referer: "https://leetcode.com/" + req.body.leetCodeId + "/",
    },
    json: true,
  };
  const calcScore = async () => {
    try {
      const score = await Promise.all([
        //codeChef
        got("https://www.codechef.com/users/" + req.body.codeChefId)
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll("h5")[0].textContent;
            a = a.split("(");
            a = a[1];
            a = a.split(")");
            a = a[0];
            a = Number(a);
            return a * 10;
          })
          .catch((err) => {
            return -1;
          }),
        //interviewBit
        got("https://www.interviewbit.com/profile/" + req.body.interviewBitId)
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll(".txt")[1];
            a = a.textContent;
            a = Number(a);
            return a;
          })
          .catch((err) => {
            return -1;
          }),
        got(
          "https://www.hackerrank.com/leaderboard?filter=" +
            req.body.hackerRankId +
            "&filter_on=hacker&page=1&track=algorithms&type=practice"
        )
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll(".score")[1].textContent;
            a = Number(a);
            return a;
          })
          .catch((err) => {
            return -1;
          }),
        got(
          "https://www.hackerrank.com/leaderboard?filter=" +
            req.body.hackerRankId +
            "&filter_on=hacker&page=1&track=data-structures&type=practice"
        )
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll(".score")[1].textContent;
            a = Number(a);
            return a;
          })
          .catch((err) => {
            return -1;
          }),
        got("https://www.spoj.com/users/" + req.body.spojId)
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll("dd")[0].textContent;
            a = Number(a);
            return a * 10;
          })
          .catch((err) => {
            return -1;
          }),
        got(
          "https://auth.geeksforgeeks.org/user/" +
            req.body.geeksForGeeksId +
            "/practice"
        )
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll("span")[13].textContent;
            a = a.split(":");
            a = Number(a[1]);
            return a;
          })
          .catch((err) => {
            return -1;
          }),
        got("https://codeforces.com/profile/" + req.body.codeForcesId + "")
          .then((response) => {
            const dom = new JSDOM(response.body);
            a = dom.window.document.querySelectorAll(
              "._UserActivityFrame_counterValue"
            )[0];
            a = a.textContent;
            a = a.split(" ");
            a = Number(a[0]);
            return a * 10;
          })
          .catch((err) => {
            return NaN;
          }),
        Participation.find({ username: req.body.rollNumber.toLowerCase() })
          .then((participation) => {
            var total = [];
            for (var i = 0; i < participation.length; i++) {
              total = total.concat(participation[i]["submissionResults"]);
            }
            var totalSet = new Set(total);
            console.log(totalSet.size * 10);
            buildIt = Number(totalSet.size) * 10;
            return buildIt;
          })
          .catch((err) => {
            return NaN;
          }),
      ]);
      request(options, async function (err, response, body) {
        var leetScore = body.data.matchedUser.submitStats.acSubmissionNum;
        leetCodeScore = Number(
          leetScore[1].count * 5 +
            leetScore[2].count * 10 +
            leetScore[3].count * 15
        );
        SkillUp.findOneAndUpdate(
          { rollNumber: req.body.rollNumber },
          {
            $set: {
              leetCodeScore: leetCodeScore,
              hackerRankScore: score[2] + score[3],
              codeChefScore: score[0],
              codeForcesScore: score[6],
              interviewBitScore: score[1],
              spojScore: score[4],
              geeksForGeeksScore: score[5],
              buildIT: score[7],
              overallScore: Math.round(
                score.reduce((a, b) => a + b, 0) + leetCodeScore
              ),
            },
          },
          { upsert: true }
        )
          .then((skillUp) => {
            // res.status(200).send(skillUp);
            return res(null, skillUp);
          })
          .catch((err) => {
            // res.status(404).send(err||"Error occured with "+req.body.rollNumber);
            return res("err", null);
          });
      });
    } catch {
      return res("err", null);
    }
  };
  calcScore();
};
exports.updateDetails = (req, res) => {
  SkillUp.findOneAndUpdate(
    { rollNumber: req.body.rollNumber },
    {
      $set: {
        leetCodeId: req.body.leetCodeId,
        hackerRankId: req.body.hackerRankId,
        codeChefId: req.body.codeChefId,
        codeForcesId: req.body.codeForcesId,
        interviewBitId: req.body.interviewBitId,
        spojId: req.body.spojId,
        geeksForGeeksId: req.body.geeksForGeeksId,
      },
    },
    { new: true }
  )
    .then((skillUp) => {
      res.status(200).send(skillUp);
      // return res(null,skillUp)
    })
    .catch((err) => {
      res.status(404).send(err || "Error occurred with " + req.body.rollNumber);
      // return res("err",null);
    });
};
exports.findAll = (callback) => {
  SkillUp.find()
    .then((skillUps) => {
      // res.send(skillUps);
      return callback(null, skillUps);
    })
    .catch((err) => {
      // res.status(500).send({
      //     success: false,
      //     message: err.message || "Some error occurred while retrieving skillUps.",
      // });
      return callback("Error retrieving skillups", null);
    });
};

exports.findAllSkillUps = (req, res) => {
  SkillUp.find()
    .sort({ overallScore: -1 })
    .then((skillUps) => {
      res.send(skillUps);
    })
    .catch((err) => {
      res.send("Error retrieving skillups");
    });
};
