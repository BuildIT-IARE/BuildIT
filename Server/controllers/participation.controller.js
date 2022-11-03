const Participate = require("../models/participation.model.js");
const Participation = Participate.Participation;
const McqParticipation = Participate.McqParticipation;
const contests = require("./contest.controller.js");
const mcqs = require("./mcq.controller.js");
var moment = require("moment");
// Create and Save a new participation
exports.create = (req, res) => {
  req.body.username = req.decoded.username;
  // Validate request
  if (!req.body.username) {
    return res.status(400).send({
      success: false,
      message: "user Id can not be empty",
    });
  }

  if (!req.body.branch && req.body.username !== "admin") {
    return res.status(400).send({
      success: false,
      message: "user Branch can not be empty",
    });
  }
  if (!req.body.contestId) {
    return res.status(400).send({
      success: false,
      message: "contest Id can not be empty",
    });
  }
  Participation.find({
    participationId: req.body.username + req.body.contestId,
  })
    .then((participation) => {
      if (participation.length === 0) {
        contests.getDuration(req, (err, duration) => {
          if (err) {
            res.send({ success: false, message: "Error occured" });
          }

          let date = moment();
          let d = duration.duration;
          let endTime = moment(date, "HH:mm:ss").add(d, "minutes");

          // Create a Participation
          const participation = new Participation({
            participationId: req.body.username + req.body.contestId,
            username: req.body.username,
            branch: req.body.branch,
            contestId: req.body.contestId,
            participationTime: date,
            submissionResults: [],
            validTill: endTime,
          });
          // Save participation in the database
          participation
            .save()
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                success: false,
                message:
                  err.message || "Some error occurred while Registering.",
              });
            });
        });
      } else {
        res.send({ success: false, message: "User already participated" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving participation.",
      });
    });
};

// Create and Save a new mcq participation
exports.createMcq = (req, res) => {
  req.body.username = req.decoded.username;
  // Validate request
  if (!req.body.username) {
    return res.status(400).send({
      success: false,
      message: "user Id can not be empty",
    });
  }

  if (!req.body.contestId) {
    return res.status(400).send({
      success: false,
      message: "contest Id can not be empty",
    });
  }

  McqParticipation.find({
    participationId: req.body.username + req.body.contestId,
  })
    .then((participation) => {
      if (participation.length === 0) {
        contests.getDuration(req, (err, duration) => {
          if (err) {
            res.send({ success: false, message: "Error occured" });
          }

          let date = moment();
          let d = duration.duration;
          let sections = duration.sections.map((e) => ({
            section: e,
            responses: [],
          }));
          if (duration.coding) {
            duration.sections.push("Coding");
          }
          let endTime = moment(date, "HH:mm:ss").add(d, "minutes");
          // Create a Participation
          const participation = new McqParticipation({
            participationId: req.body.username + req.body.contestId,
            username: req.body.username,
            contestId: req.body.contestId,
            contestName: duration.contestName,
            participationTime: date,
            submissionResults: [],
            totalSubmissionResultsScore: 0,
            mcqResults: {},
            validTill: endTime,
            responses: sections,
            sections: duration.sections,
          });
          // Save participation in the database
          participation
            .save()
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                success: false,
                message:
                  err.message || "Some error occurred while Registering.",
              });
            });
        });
      } else {
        res.send({ success: false, message: "User already participated" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving participation.",
      });
    });
};

// add sol to mcq participation
exports.acceptSelection = (sub, callback) => {
  // Find participation and update it with the request body
  McqParticipation.find({ participationId: sub.participationId })
    .then((participation) => {
      // Check prev selection
      const sec = participation[0].responses[sub.section - 1].section;
      const selections = participation[0].responses[sub.section - 1].responses;
      found = false;
      if (selections.length !== 0) {
        selections.forEach((selection) => {
          if (selection.mcqId === sub.mcqId) {
            found = true;

            // Update selection
            console.log("Came here");
            const query_field = `responses.${sub.section - 1}.responses.mcqId`;
            const field = `responses.${sub.section - 1}.responses.$.selection`;
            const value = sub.answer;
            const obj = { [field]: value };
            McqParticipation.updateOne(
              {
                participationId: sub.participationId,
                [query_field]: sub.mcqId,
              },
              {
                $set: obj,
              },
              { new: true }
            )
              .then((participations) => {
                if (!participations) {
                  return callback("Participation not found with Id ", null);
                }
                return callback(null, participations);
              })
              .catch((err) => {
                if (err.kind === "ObjectId") {
                  return callback("Participation not found with Id ", null);
                }
                return callback("Error updating Participation with Id ", null);
              });
          }
        });
      }
      if (!found) {
        // const field = `responses.${sec}`;
        const field = `responses.${sub.section - 1}.responses`;
        McqParticipation.findOneAndUpdate(
          { participationId: sub.participationId },
          {
            $addToSet: {
              [field]: {
                mcqId: sub.mcqId,
                questionNum: sub.questionNum,
                selection: sub.answer,
              },
            },
          },
          { new: true }
        )
          .then((participation) => {
            if (!participation) {
              return callback("Participation not found with Id ", null);
            }
            return callback(null, participation);
          })
          .catch((err) => {
            // console.log(err);
            if (err.kind === "ObjectId") {
              return callback("Participation not found with Id ", null);
            }
            return callback("Error updating Participation with Id ", null);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving participation.",
      });
    });
};

// add sol to participation
exports.acceptSubmission = (sub, callback) => {
  // Change here
  // Find participation and update it with the request body
  if (sub.check) {
    McqParticipation.find({ participationId: sub.participationId })
      .then((participation) => {
        // Check prev sub
        participation = participation[0];
        found = false;
        updated = false;
        if (participation.submissionResults.length !== 0) {
          for (let i = 0; i < participation.submissionResults.length; i++) {
            if (
              participation.submissionResults[i].questionId === sub.questionId
            ) {
              found = true;
              if (participation.submissionResults[i].score < sub.score) {
                // Update higher score
                updated = true;
                console.log("Came here");
                McqParticipation.updateOne(
                  {
                    participationId: sub.participationId,
                    "submissionResults.questionId": sub.questionId,
                  },
                  {
                    $set: {
                      "submissionResults.$.score": sub.score,
                      "submissionResults.$.ipAddress": sub.ipAddress,
                    },
                    $inc: {
                      totalSubmissionResultsScore: sub.score,
                    },
                  },
                  { new: true }
                )
                  .then((participation) => {
                    if (!participation) {
                      return callback("Participation not found with Id ", null);
                    }
                    return callback(null, participation);
                  })
                  .catch((err) => {
                    if (err.kind === "ObjectId") {
                      return callback("Participation not found with Id ", null);
                    }
                    return callback(
                      "Error updating Participation with Id ",
                      null
                    );
                  });
              }
            }
          }
          if (found && !updated) {
            return callback(null, participation);
          }
        }
        if (!found) {
          McqParticipation.findOneAndUpdate(
            { participationId: sub.participationId },
            {
              $addToSet: {
                submissionResults: {
                  questionId: sub.questionId,
                  score: sub.score,
                  ipAddress: sub.ipAddress,
                },
              },
              $inc: {
                totalSubmissionResultsScore: sub.score,
              },
            },
            { new: true }
          )
            .then((participation) => {
              if (!participation) {
                return callback("Participation not found with Id ", null);
              }
              return callback(null, participation);
            })
            .catch((err) => {
              console.log(err);
              if (err.kind === "ObjectId") {
                return callback("Participation not found with Id ", null);
              }
              return callback("Error updating Participation with Id ", null);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          success: false,
          message:
            err.message ||
            "Some error occurred while retrieving participation.",
        });
      });
  } else {
    Participation.find({ participationId: sub.participationId })
      .then((participation) => {
        // Check prev sub
        participation = participation[0];

        multiset = true;
        if (participation.questions.length !== 0) {
          if (!participation.questions.includes(sub.questionId)) {
            multiset = false;
            return callback(null, participation);
          }
        }
        if (multiset) {
          found = false;
          updated = false;
          if (participation.submissionResults.length !== 0) {
            for (let i = 0; i < participation.submissionResults.length; i++) {
              if (
                participation.submissionResults[i].questionId === sub.questionId
              ) {
                found = true;
                if (participation.submissionResults[i].score < sub.score) {
                  // Update higher score
                  updated = true;
                  console.log("Came here");
                  Participation.updateOne(
                    {
                      participationId: sub.participationId,
                      "submissionResults.questionId": sub.questionId,
                    },
                    {
                      $set: {
                        "submissionResults.$.score": sub.score,
                        "submissionResults.$.ipAddress": sub.ipAddress,
                      },
                    },
                    { new: true }
                  )
                    .then((participation) => {
                      if (!participation) {
                        return callback(
                          "Participation not found with Id ",
                          null
                        );
                      }
                      return callback(null, participation);
                    })
                    .catch((err) => {
                      if (err.kind === "ObjectId") {
                        return callback(
                          "Participation not found with Id ",
                          null
                        );
                      }
                      return callback(
                        "Error updating Participation with Id ",
                        null
                      );
                    });
                }
              }
            }
            if (found && !updated) {
              return callback(null, participation);
            }
          }
          if (!found) {
            Participation.findOneAndUpdate(
              { participationId: sub.participationId },
              {
                $addToSet: {
                  submissionResults: {
                    questionId: sub.questionId,
                    score: sub.score,
                    ipAddress: sub.ipAddress,
                  },
                },
              },
              { new: true }
            )
              .then((participation) => {
                if (!participation) {
                  return callback("Participation not found with Id ", null);
                }
                return callback(null, participation);
              })
              .catch((err) => {
                console.log(err);
                if (err.kind === "ObjectId") {
                  return callback("Participation not found with Id ", null);
                }
                return callback("Error updating Participation with Id ", null);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          success: false,
          message:
            err.message ||
            "Some error occurred while retrieving participation.",
        });
      });
  }
};

// Retrieve and return all participations from the database.
exports.findAll = (req, res) => {
  Participation.find()
    .then((participation) => {
      res.send(participation);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving participation.",
      });
    });
};

// Retrieve and return all participation details for user in contest.
exports.findUser = (req, res) => {
  Participation.find({
    participationId: req.decoded.username + req.params.contestId,
  })
    .then((participation) => {
      res.send(participation);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving participation.",
      });
    });
};

// Retrieve and return all participation details for user in contest.
exports.findParticipation = (req, callback) => {
  Participation.find({
    participationId: req.decoded.username + req.params.contestId,
  })
    .then((participation) => {
      if (participation.length === 0) {
        return callback("participation not found ", null);
      }

      participation = participation[0];
      return callback(null, participation);
    })
    .catch((err) => {
      return callback(err || "Error retrieving contest", null);
    });
};

// Update a participation identified by the contestId in the request
exports.updateParticipation = (req, questions, callback) => {
  Participation.findOneAndUpdate(
    { participationId: req.decoded.username + req.params.contestId },
    {
      $set: {
        questions: questions,
      },
    },
    { new: true }
  )
    .then((participation) => {
      if (!participation) {
        return callback("Contest not found ", null);
      }
      participation = participation[0];
      return callback(null, participation);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return callback("Contest not found", null);
      }
      return callback("Error retrieving contest", null);
    });
};

// Retrieve and return all participation details.
exports.findContestPart = (req, res) => {
  Participation.find({ contestId: req.body.contestId })
    .then((participation) => {
      res.send(participation);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving participation.",
      });
    });
};
// Retrieve and return all mcqParticipation details.
exports.findQualContestPart = (req, res) => {
  McqParticipation.find({ contestId: req.body.contestId })
    .then((participation) => {
      res.send(participation);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving participation.",
      });
    });
};

// Retrieve user participation time.
exports.findUserTime = (result, callback) => {
  if (result.check) {
    McqParticipation.find({ participationId: result.participationId })
      .then((participation) => {
        if (!participation) {
          return callback("Couldn't find participation", null);
        }
        return callback(null, participation);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return callback(
            "Couldn't find participation, caught exception",
            null
          );
        }
        return callback("Error retrieving data", null);
      });
  } else {
    Participation.find({ participationId: result.participationId })
      .then((participation) => {
        if (!participation) {
          return callback("Couldn't find participation", null);
        }
        return callback(null, participation);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return callback(
            "Couldn't find participation, caught exception",
            null
          );
        }
        return callback("Error retrieving data", null);
      });
  }
};

// Retrieve and return all participation details for user in contest.
exports.findMcqParticipation = (req, res) => {
  McqParticipation.find({
    participationId: req.decoded.username + req.params.contestId,
  })
    .then((participation) => {
      res.send(participation);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving participation.",
      });
    });
};

// create and save a new score
exports.saveResult = (req, res) => {
  req.body.username = req.decoded.username;
  // Validate request
  if (!req.body.username) {
    return res.status(400).send({
      success: false,
      message: "user Id can not be empty",
    });
  }

  if (!req.params.contestId) {
    return res.status(400).send({
      success: false,
      message: "contest Id can not be empty",
    });
  }
  McqParticipation.find({
    participationId: req.body.username + req.params.contestId,
  })
    .then((participation) => {
      if (participation[0].mcqResults.compute) {
        let totalCodingScore = 0;
        for (let i = 0; i < participation[0].submissionResults.length; i++) {
          totalCodingScore += Number(
            participation[0].submissionResults[i].score
          );
        }
        mcqs.findAllMcqContest(req.params.contestId, (err, mcq) => {
          if (err) {
            res.send({ success: false, message: "Error occured" });
          }
          let responses = participation[0].responses.map((e) => e.responses); // array of 4 arrays
          mcq = mcq.map((v) => v.books); // array of 4 arrays each having mcqs array from 1 section
          if (mcq.length !== responses.length) {
            return res.send({ success: false, message: "Error occured" });
          }

          let sectionCount = mcq.length;
          let answer = Array(sectionCount).fill([]);
          let score = Array(sectionCount).fill([]);
          let scoreCnt = Array(sectionCount).fill(0);
          let attemptCnt = Array(sectionCount).fill(0);
          let divisionCnt = Array(sectionCount).fill(0);
          let totalCodingScore = 0;

          //calc Coding Score
          for (let i = 0; i < participation[0].submissionResults.length; i++) {
            totalCodingScore += Number(
              participation[0].submissionResults[i].score
            );
          }

          for (let i = 0; i < sectionCount; i++) {
            let sectionLen = mcq[i].length;
            let sectionResponseLen = responses[i].length;

            attemptCnt[i] = sectionResponseLen;
            divisionCnt[i] = sectionLen;

            answer[i] = mcq[i].map((v) => v.answer);
            score[i] = Array(sectionLen).fill(0);
            responses[i].sort((v, w) => v.questionNum - w.questionNum);

            let k = 0;
            for (let j = 0; j < sectionLen && k < sectionResponseLen; j++) {
              if (responses[i][k].mcqId === mcq[i][j].mcqId) {
                let currScore =
                  Number(responses[i][k].selection) === mcq[i][j].answer
                    ? 1
                    : 0;
                scoreCnt[i] += currScore;
                score[i][j] = {
                  questionNum: j + 1,
                  selected: responses[i][k].selection,
                  answer: mcq[i][j].answer,
                  score: currScore,
                };
                ++k;
              }
            }
          }
          totalCnt = scoreCnt.reduce((a, b) => a + b, 0);
          let totalCount = divisionCnt.reduce((a, b) => a + b, 0);
          let submission = {
            compute: false,
            totalScore: totalCnt,
            totalCount: totalCount,
            divisionScore: scoreCnt,
            divisionCount: divisionCnt,
            divisionAttemptCount: attemptCnt,
            statistics: score,
            answerKey: answer,
          };
          console.log("came there");
          McqParticipation.findOneAndUpdate(
            { participationId: participation[0].participationId },
            {
              $set: {
                mcqResults: submission,
                validTill: participation[0].participationTime,
                totalSubmissionResultsScore: totalCodingScore,
              },
            },
            { new: true }
          )
            .then((participations) => {
              if (!participations) {
                return res.status(404).send({
                  success: false,
                  message:
                    "Question not found with Contest id " +
                    req.params.contestId,
                });
              }
              let participation = participations.mcqResults._doc;
              participation.sections = participations.sections;
              participation.contestName = participations.contestName;
              participations.coding = participation[0].submissionResults;
              // participation.coding = participations.submissionResults;
              res.send(participation);
            })
            .catch((err) => {
              console.log(err);
              if (err.kind === "ObjectId") {
                return res.status(404).send({
                  success: false,
                  message:
                    "Question not found with Contest id " +
                    req.params.contestId +
                    "Please Reload",
                });
              }
              return res.status(500).send({
                success: false,
                message:
                  "Error retrieving question with Contest id " +
                  req.params.contestId,
              });
            });
        });
      } else {
        let participations = participation[0].mcqResults._doc;
        participations.sections = participation[0].sections;
        participations.contestName = participation[0].contestName;
        participations.coding = participation[0].submissionResults;
        // participations.coding = participation[0].submissionResults;

        res.send(participations);
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving participation.",
      });
    });
};

// create and save a new score
exports.leaderboard = async (req, res) => {
  try {
    let participation1 = await McqParticipation.find({
      contestId: req.params.contestId,
    });
    let leaderboard = participation1.map((e) => ({
      username: e.username,
      totalScore: e.mcqResults.totalScore + e.totalSubmissionResultsScore,
    }));
    res.send(leaderboard);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: err.message || "Error occurred!",
    });
  }
};

exports.endContest = async (req, res) => {
  let findval = req.body.username.toLowerCase() + req.body.contestId;
  Participation.findOne({ participationId: findval })
    .then((paricipation) => {
      let setval = paricipation.participationTime;
      Participation.findOneAndUpdate(
        { participationId: findval },
        {
          $set: {
            validTill: setval,
          },
        }
      )
        .then(() => {
          res.send("done");
        })
        .catch((err) => {
          res.send("error");
        });
    })
    .catch((err) => {
      res.send("error");
    });
};

exports.changeValidTime = (req, res) => {
  const username = req.body.username.toLowerCase();
  const contestId = req.body.contestId;
  var participationId = username + contestId;
  Participation.findOne({ participationId: participationId })
    .then((data) => {
      // console.log(data.validTill,new Date());
      const time = Number(req.body.time);
      var data = new Date(data.validTill);
      data.setTime(data.getTime() + time * 60 * 1000);
      Participation.findOneAndUpdate(
        { participationId: participationId },
        {
          $set: {
            participationId: participationId,
            validTill: data,
            endContest: 0,
          },
        },
        { upsert: true }
      )
        .then((data) => {
          res.status(200).send("Updated Successfully!");
        })
        .catch((err) => {
          res.status(500).send({
            success: false,
            message: "Error occurred!",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Error occurred!",
      });
    });
};

exports.checkContest = (req, res) => {
  let a = req.body.username.toLowerCase() + req.body.testId;
  Participation.findOne({ participationId: a })
    .then((participation) => {
      let setval = participation.participationTime;
      if (
        participation["endContest"] != undefined &&
        participation.endContest == 0
      ) {
        Participation.updateOne(
          { participationId: a },
          {
            $set: {
              endContest: 1,
            },
          }
        )
          .then(() => {
            res.send("success");
          })
          .catch((err) => {
            res.send("error");
          });
      } else {
        Participation.updateOne(
          { participationId: a },
          {
            $set: {
              validTill: setval,
            },
          }
        )
          .then(() => {
            res.send("success");
          })
          .catch((err) => {
            res.send("error");
          });
      }
    })
    .catch((err) => {
      res.send("error");
    });
};

exports.findAllContestsUser = (req, res) => {
  Participation.find({ username: req.body.username })
    .then((participation) => {
      res.send({
        success: true,
        count: participation.length,
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        count: 0,
      });
    });
};

exports.findUserPartTime = (req, res) => {
  if (req.params.mcq === "NO") {
    Participation.find({ participationId: req.params.participationId })
      .then((participation) => {
        res.send({
          success: true,
          data: participation,
        });
      })
      .catch((err) => {
        res.send({
          success: false,
        });
      });
  } else {
    McqParticipation.find({
      participationId: req.body.username + req.body.contestId,
    })
      .then((participation) => {
        res.send({
          success: true,
          data: participation,
        });
      })
      .catch((err) => {
        res.send({
          success: false,
        });
      });
  }
};
