const { workerData, parentPort } = require("worker_threads");
const request = require("request");
const jsdom = require("jsdom");
const got = require("got");
const { JSDOM } = jsdom;
const Participation = require("../../models/participationTut.model.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../../util/config.env" });
const SkillUpModel = require("../../models/skillUp.model.js");

dbConfig = {
  url: process.env.dbURL,
};

var codeChefLink = "https://www.codechef.com/users/";
var interviewBitLink = "https://www.interviewbit.com/profile/";
var hackerRankFilter = "https://www.hackerrank.com/leaderboard?filter=";
var hackerRankAlgoFilter =
  "&filter_on=hacker&page=1&track=algorithms&type=practice";
var hackerRankDSFilter =
  "&filter_on=hacker&page=1&track=data-structures&type=practice";
var spojLink = "https://www.spoj.com/users/";
var geeksForGeeksLink = "https://auth.geeksforgeeks.org/user/";
var codeForcesLink = "https://codeforces.com/profile/";
var leetCodeApi = "https://leetcode.com/graphql";
var leetCodeLink = "https://leetcode.com/";

function getLeetCodeScore(leetCodeId) {
  var leetCodeScore = 0;
  const options = {
    url: leetCodeApi,
    method: "post",
    body: {
      operationName: "getUserProfile",
      variables: {
        username: leetCodeId,
      },
      query:
        "query getUserProfile($username: String!) {  allQuestionsCount {    difficulty    count  }  matchedUser(username: $username) {    contributions {    points      questionCount      testcaseCount    }    profile {    reputation      ranking    }    submitStats {      acSubmissionNum {        difficulty        count        submissions      }      totalSubmissionNum {        difficulty        count        submissions      }    }  }}",
    },
    headers: {
      referer: leetCodeLink + leetCodeId + "/",
    },
    json: true,
  };

  return new Promise(function (resolve, reject) {
    request(options, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        let leetCodeScores = body.data.matchedUser.submitStats.acSubmissionNum;
        leetCodeScore =
          leetCodeScores[1].count * 5 +
          leetCodeScores[2].count * 10 +
          leetCodeScores[3].count * 15;
        resolve(leetCodeScore);
      } else {
        reject(err);
      }
    });
  });
}

function getCodeChefScore(codeChefId) {
  var codeChefScore = 0;
  return new Promise (function (resolve, reject) {
    got(codeChefLink + codeChefId)
    .then((res) => {
      const dom = new JSDOM(res.body);
      codeChefScore = dom.window.document.querySelectorAll("h5")[0].textContent;
      codeChefScore = codeChefScore.split("(")[1];
      codeChefScore = codeChefScore.split(")")[0];
      codeChefScore = Number(codeChefScore);
      codeChefScore = Math.round(codeChefScore * 10);
      resolve(codeChefScore);
    })
    .catch((err) => {
      reject(err);
    })
  })
}

function getInterviewBitScore(interviewBitId) {
    var interviewBitScore = 0;
    return new Promise (function (resolve, reject) {
        got(interviewBitLink + interviewBitId)
        .then((res) => {
            const dom = new JSDOM(res.body);
            interviewBitScore = dom.window.document.querySelectorAll(".txt")[1].textContent;
            interviewBitScore = Number(interviewBitScore);
            interviewBitScore = Math.round(interviewBitScore);
            resolve(interviewBitScore);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function getHackerRankAlgoScore(hackerRankId) {
  var hackerRankAlgoScore = 0;
  return new Promise(function (resolve, reject) {
    got(hackerRankFilter + hackerRankId + hackerRankAlgoFilter)
      .then((res) => {
        const dom = new JSDOM(res.body);
        hackerRankAlgoScore = dom.window.document.querySelectorAll(".score")[1].textContent;
        hackerRankAlgoScore = Number(hackerRankAlgoScore);
        hackerRankAlgoScore = Math.round(hackerRankAlgoScore);
        resolve(hackerRankAlgoScore);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getHackerRankDsScore(hackerRankId) {
  var hackerRankDsScore = 0;
  return new Promise(function (resolve, reject) {
    got(hackerRankFilter + hackerRankId + hackerRankDSFilter)
      .then((res) => {
        const dom = new JSDOM(res.body);
        hackerRankDsScore = dom.window.document.querySelectorAll(".score")[1].textContent;
        hackerRankDsScore = Number(hackerRankDsScore);
        hackerRankDsScore = Math.round(hackerRankDsScore);
        resolve(hackerRankDsScore);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getSpojScore(spojId) {
  var spojScore = 0;
  return new Promise(function (resolve, reject) {
    got(spojLink + spojId)
      .then((res) => {
        const dom = new JSDOM(res.body);
        spojScore = dom.window.document.querySelectorAll("dd")[0].textContent;
        spojScore = Number(spojScore);
        spojScore = Math.round(spojScore * 10);
        resolve(spojScore);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getGeeksForGeeksScore(geeksForGeeksId) {
  var geeksForGeeksScore = 0;
  return new Promise(function (resolve, reject) {
    got(geeksForGeeksLink + geeksForGeeksId)
      .then((res) => {
        const dom = new JSDOM(res.body);
        geeksForGeeksScore = dom.window.document.querySelectorAll(".score_card_value")[0].textContent;
        geeksForGeeksScore = Number(geeksForGeeksScore);
        geeksForGeeksScore = Math.round(geeksForGeeksScore);
        resolve(geeksForGeeksScore);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getCodeForcesScore(codeForcesId) {
  var codeForcesScore = 0;
  return new Promise(function (resolve, reject) {
    got(codeForcesLink + codeForcesId)
      .then((res) => {
        const dom = new JSDOM(res.body);
        codeForcesScore = dom.window.document.querySelectorAll("._UserActivityFrame_counterValue")[0].textContent.split(" ")[0];
        codeForcesScore = Number(codeForcesScore);
        codeForcesScore = Math.round(codeForcesScore * 10);
        resolve(codeForcesScore);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getBuildItScore(buildItId) {
  var buildItScore = 0;
  var res = await Participation.find({ username: buildItId.toLowerCase() })
  if (!res.length){
    return buildItScore;
  }
  var total = [];
  for (var i = 0;i < res.length; i++){
    total = total.concat(res[i]["submissionResults"]);
  }
  var totalSet = new Set(total);
  buildItScore = Number(totalSet.size);
  buildItScore = buildItScore * 10;
  return buildItScore;
}

async function main() {
  mongoose.set('strictQuery', true);
  await mongoose
    .connect(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  var leetCodeScore = await getLeetCodeScore(workerData.leetCodeId);
  var codeChefScore = await getCodeChefScore(workerData.codeChefId);
  var interviewBitScore = await getInterviewBitScore(workerData.interviewBitId);
  var hackerRankAlgoScore = await getHackerRankAlgoScore(workerData.hackerRankId);
  var hackerRankDsScore = await getHackerRankDsScore(workerData.hackerRankId);
  var spojScore = await getSpojScore(workerData.spojId);
  var geeksForGeeksScore = await getGeeksForGeeksScore(workerData.geeksForGeeksId);
  var codeForcesScore = await getCodeForcesScore(workerData.codeForcesId);
  var buildItScore = await getBuildItScore(workerData.rollNumber);
  var totalScore = leetCodeScore + codeChefScore + interviewBitScore 
                  + hackerRankAlgoScore + hackerRankDsScore + spojScore + geeksForGeeksScore + codeForcesScore + buildItScore;
  const update = await SkillUpModel.findOneAndUpdate(
    { rollNumber: workerData.rollNumber },
    {
        $set: {
            leetCodeScore: leetCodeScore,
            hackerRankScore: hackerRankAlgoScore + hackerRankDsScore,
            codeChefScore: codeChefScore,
            interviewBitScore: interviewBitScore,
            spojScore: spojScore,
            geeksForGeeksScore: geeksForGeeksScore,
            codeForcesScore: codeForcesScore,
            buildIT: buildItScore,
            overallScore: totalScore
        }
    }
  )
  if (!update){
      parentPort.postMessage("Error in Updating " + workerData.rollNumber);
  }
  parentPort.postMessage("Updated " + workerData.rollNumber);
  mongoose.connection.close();
}

main();