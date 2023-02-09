const Mcqs = require("../models/mcq.model.js");
const contestLong  = require("../models/mcqcontestLong.model.js")


let createContest = async (req,res)=>{
    console.log(req.body);
    if(!req.body.contestId){
        return res.status(400).send({
            success: false,
            message: "ContestId can not be empty"
        })
    }

    if (!req.body.contestName) {
        return res.status(400).send({
          success: false,
          message: "Contestname can not be empty",
        });
    }

    if (!req.body.contestStartTime) {
        return res.status(400).send({
          success: false,
          message: "ContestStartTime can not be empty",
        });
    }

    if (!req.body.contestEndTime) {
        return res.status(400).send({
            success: false,
            message: "ContestEndTime can not be empty",
        });
    }

    if (!req.body.contestStartDate) {
        return res.status(400).send({
            success: false,
            message: "ContestStartDate can not be empty",
        });
    }

    if (!req.body.contestEndDate) {
        return res.status(400).send({
            success: false,
            message: "ContestEndDate can not be empty",
        });
    }

    let usernames = [""];
    let sections = [""];

    if (req.body.contestSections)
        sections = req.body.contestSections.split(",").map((e) => e.trim());


    const newContest = new contestLong({
        contestId: req.body.contestId,
        contestName: req.body.contestName,
        contestStartTime: req.body.contestStartTime,
        contestEndTime: req.body.contestEndTime,
        contestStartDate: req.body.contestStartDate,
        contestEndDate: req.body.contestEndDate,
        mcq: true,
        usernames: usernames,
        sections: sections,
        coding: req.body.coding,
        contestPassword: req.body.contestPassword,
    })

    newContest.save()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({
            success: false,
            message:
            err.message,
        })
    })
}

let checkContestActive = async (req, res) => {
    let contestId = req.body.contestId;
    let username = req.body.username;
    let contestPassword = req.body.contestPassword;

    let contest = await contestLong.findOne({contestId: contestId});
    if(!contest){
        return res.status(400).send({
            success: false,
            message: "Contest not found"
        })
    }
    // if(contest.contestPassword != contestPassword){
    //     return res.status(400).send({
    //         success: false,
    //         message: "Incorrect Password"
    //     })
    // }
    // if(!inarray(username, contest.usernames)){
    //     return res.status(400).send({
    //         success: false,
    //         message: "Username not found"
    //     })
    // }
    let now = new Date();
    let contestStartDate = new Date(contest.contestStartDate);
    let contestEndDate = new Date(contest.contestEndDate);
    let contestStartTime = new Date(contest.contestStartTime);
    let contestEndTime = new Date(contest.contestEndTime);

    let contestStart = new Date(contest.contestStartDate + " " + contest.contestStartTime);
    let contestEnd = new Date(contest.contestEndDate + " " + contest.contestEndTime);



    if(now < contestStart){
        return res.status(400).send({
            success: false,
            message: "Contest has not started yet"
        })
    }
    if(now > contestEnd){
        return res.status(400).send({
            success: false,
            message: "Contest has ended"
        })
    }
    // if(now < contestStartTime){
    //     return res.status(400).send({
    //         success: false,
    //         message: "Contest has not started yet"
    //     })
    // }
    // if(now > contestEndTime){
    //     return res.status(400).send({
    //         success: false,
    //         message: "Contest has ended"
    //     })
    // }
    return res.status(200).send({
        success: true,
        message: "Contest Active"
    })
}

let getContest = async (req, res) => {
    const contestId = req.params.contestId || req.body.contestId;
    contestLong.findOne({ contestId: contestId })
    .then((contest) => {
        if (!contest) {
            return res.status(404).send({
                success: false,
                message: "Contest not found",
            });
        }
        res.send(contest);
    })
    .catch((err) => {
        if (err.kind === "ObjectId") {
            return res.status(404).send({
                success: false,
                message: "Contest not found",
            });
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving contest",
        });
    });
}

let getAllContests = async (req, res) => {
    contestLong.find()
    .then((contests) => {
        console.log(contests)
        res.send(contests);
    })
    .catch((err) => {
        return res.status(500).send({
            success: false,
            message: "Error retrieving contests",
        });
    });
}

let getContestQuestions = async (req, res) => {
    const contestId = req.params.contestId;
    
    const contest = await contestLong.findOne({contestId: contestId});

    if(!contest){
        return res.status(400).send({
            success: false,
            message: "Contest not found"
        })
    }

    Mcqs.find({contestId: contestId})
    .then((mcqs) => {
        res.send(mcqs);
    })
    .catch((err) => {
        return res.status(500).send({
            success: false,
            message: "Error retrieving mcqs",
        });
    });
}

let isLongContest = async (req, res) => {
    const contestId = req.params.contestId;
    if (!contestId) {
        return res.status(400).send({
            success: false,
            message: "ContestId can not be empty",
        });
    }
    contestLong.findOne({ contestId: contestId })
    .then((contest) => {
        if (!contest) {
            return res.status(404).send({
                success: false,
                message: "Contest not found",
            });
        }
        res.send({
            success: true,
            message: "Contest found",
            isLongContest: true
        });
    })
    .catch((err) => {
        if (err.kind === "ObjectId") {
            return res.status(404).send({
                success: false,
                message: "Contest not found",
            });
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving contest",
        });
    });
}


let getDurationLong = (req, callback) => {
    contestLong.find({ contestId: req.body.contestId })
      .then((contest) => {
        if (!contest) {
          return callback("Contest not found ", null);
        }
        console.log(contest);
        contest = contest[0];
        let validTill = new Date(contest.contestEndDate + " " + contest.contestEndTime.slice(0, 2) + ":" + contest.contestEndTime.slice(2, 5) + ":00");
        // contestDuration = (new Date(contest.contestEndDate + " " + contest.contestEndTime.slice(0, 2) + ":" + contest.contestEndTime.slice(3, 5) + ":00") - new Date(contest.contestStartDate + " " + contest.contestStartTime.slice(0, 2) + ":" + contest.contestStartTime.slice(3, 5) + ":00" ))
        // validTill = moment(validTill, "HH:mm:ss");
        // console.log("lvjkndslkjvn;dsknvfdslkvjn*************", validTill);
        let durationData = {
          startTime: contest.contestStartTime,
          endTime: contest.contestEndTime,
          startDate: contest.contestStartDate,
          endDate: contest.contestEndDate,
          contestDuration: String((validTill.getTime() - new Date().getTime())/60000) > 0 ? String((validTill.getTime() - new Date().getTime())/60000) : "0",
          validTill: validTill,
          mcq: contest.mcq,
          sections: contest.sections,
          contestName: contest.contestName,
          coding: contest.coding,
        };
        console.log(durationData)
        return callback(null, durationData);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return callback("Contest not found", null);
        }
        return callback("Error retrieving contest", null);
      });
  };

module.exports = {
    createContest,
    checkContestActive,
    getContest,
    getAllContests,
    getContestQuestions,
    isLongContest,
    getDurationLong,
}