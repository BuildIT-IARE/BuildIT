const Mcq = require("../models/mcq.model.js");
const Question = require("../models/question.model.js");
const inarray = require("inarray");
const xlsx = require("xlsx");
const fs = require("fs");

// Create and Save a new question
exports.create = (req, res) => {
  // Validate request

  if (!req.body.contestId) {
    return res.status(400).send({
      success: false,
      message: "contest Id name can not be empty",
    });
  }

  Mcq.find()
    .then((mcqs) => {
      let currQuestions = mcqs.length + 1;
      req.body.questionId = "IARE" + currQuestions.toString();

      // Create a Question
      const question = new Mcq({
        mcqId: req.body.questionId,
        contestId: req.body.contestId,
        mcqDescriptionText: req.body.questionDescriptionText,
        option1: req.body.op1,
        option2: req.body.op2,
        option3: req.body.op3,
        option4: req.body.op4,
        answer: req.body.answer,
        section: req.body.section,
      });

      // Save Question in the database
      question
        .save()
        .then((data) => {
          if (req.files && req.files.photo) {
            updateImage(req.body.questionId);
            return;
          }
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            success: false,
            message:
              err.message || "Some error occurred while creating the mcqs.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while retrieving mcqs.",
      });
    });

  const updateImage = (mcqId) => {
    let file = req.files.photo;
    let uploadpath = `../Public/${mcqId}`;
    file.mv(uploadpath, async (err) => {
      if (err) {
        console.log(err);
        res.send("Error Occured!");
      } else {
        let file = fs.readFileSync(`../Public/${mcqId}`);
        var img = {
          data: file,
          contentType: "image/png",
        };
        const result = await uploadImage(mcqId, img);
        if (result) {
          res.redirect(clientAddress + "/error" + "?message=" + result);
        }
        fs.unlinkSync(`../Public/${mcqId}`, console.log(err));
      }
    });
  };

  const uploadImage = async (mcqId, img) => {
    return Mcq.findOneAndUpdate(
      { mcqId: mcqId },
      {
        $set: {
          photo: img,
        },
      },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log(err);
        }
      }
    )
      .then((mcq) => {
        if (!mcq) {
          return "mcq not found with mcqId  " + mcqId;
        }
        mcq._doc.photo = "base64 file";
        res.send(mcq._doc);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return "mcq not found with mcqId  " + mcqId;
        }
        return "Error updating mcq with id " + mcqId;
      });
  };
};

exports.createExcel = (req, res) => {
  if (req.files.upfile) {
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    var uploadpath = "../quesxlsx" + name;
    file.mv(uploadpath, function (err) {
      if (err) {
        console.log("File Upload Failed", name, err);
        res.send("Error Occured!");
      } else {
        let wb = xlsx.readFile("../quesxlsx" + name);
        let ws = wb.Sheets["Sheet1"];
        let data = xlsx.utils.sheet_to_json(ws);
        let question;
        Mcq.find()
          .then((mcqs) => {
            let currQuestions = mcqs.length;
            for (let i = 0; i < data.length; i++) {
              question = new Mcq({
                mcqId: "IARE" + (currQuestions + (i + 1)).toString(),
                contestId: data[i].contestId,
                mcqDescriptionText: data[i].mcqDescriptionText,
                option1: data[i].op1,
                option2: data[i].op2,
                option3: data[i].op3,
                option4: data[i].op4,
                answer: data[i].answer,
                section: data[i].section,
              });

              // Save Question in the database
              question.save();
            }
            res.send("Done! Uploaded files");
          })
          .catch((err) => {
            res.status(500).send({
              success: false,
              message:
                err.message || "Some error occurred while retrieving mcqs.",
            });
          });
      }
    });
  } else {
    res.send("No File selected !");
    res.end();
  }
};
// testing start-------------------------------------------------------------------------------
// Retrieve and return all mcqs from the database.
exports.findAll = (req, res) => {
  Mcq.find()
    .then((mcqs) => {
      res.send(mcqs);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while retrieving mcqs.",
      });
    });
};

exports.findAllContest = (req, res) => {
  Mcq.find({ contestId: req.params.contestId })
    .then((mcq) => {
      if (!mcq) {
        return res.status(404).send({
          success: false,
          message: "Question not found with Contest id " + req.params.contestId,
        });
      }
      res.send(mcq);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Question not found with Contest id " + req.params.contestId,
        });
      }
      return res.status(500).send({
        success: false,
        message:
          "Error retrieving question with Contest id (Please Reload)" + req.params.contestId,
      });
    });
};
// testing end-------------------------------------------------------------------------------

// Find all questions for a contestId
exports.findOneQuestion = async (req, res) => {
  Question.find({ contestId: req.params.contestId })
    .then((mcqs) => {
      if (!mcqs || mcqs.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Question not found with contest Id " + req.params.contestId,
        });
      }
      let index = parseInt(req.body.questionNum);
      let mcq = mcqs[index]._doc;

      mcq.ids = mcqs.map((v, index) => [v.questionId, index]);
      mcq.section = 5;
      mcq.questionNum = index + 1;
      mcq.sectionLen = mcqs.length;
      mcq.isPartial = req.body.isPartial;
      
      if (mcq.isPartial)
      {
        mcq.sections = req.body.sections;
      }

      res.send(mcq);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: err+ "Question not found with id " + req.params.contestId,
        });
      }
      return res.status(500).send({
        success: false,
        message: err +"Error retrieving question with id " + req.params.contestId,
      });
    });
};

exports.findOneContest = (req, res) => {
  Mcq.find({
    contestId: req.params.contestId,
    section: Number(req.params.section),
  })
    .then((mcqs) => {
      if (!mcqs) {
        return res.status(404).send({
          success: false,
          message: "Question not found with Contest id " + req.params.contestId,
        });
      }
      // mcqs.sort( (a, b) => a.mcqId.substring(4) - b.mcqId.substring(4) );
      // let min = mcqs.reduce( (a, b) => a.mcqId.substring(4) > b.mcqId.substring(4)? a : b );
      let index = parseInt(req.params.questionNum);

      let mcq = mcqs[index]._doc;
      mcq.answer = null;
      mcq.questionNum = index + 1;
      mcq.sectionLen = mcqs.length;
      mcq.photo = mcq.photo.contentType
        ? mcq.photo.data.toString("base64")
        : "";

      res.send(mcq);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Question not found with Contest id " + req.params.contestId,
        });
      }
      return res.status(500).send({
        success: false,
        message:
          "Error retrieving question with Contest id " + req.params.contestId,
      });
    });
};

// Retrieve first mcq
exports.findRecent = (req, res) => {
  Mcq.aggregate([
    { $match: { contestId: req.params.contestId } },
    {
      $group: {
        _id: "$section",
        myCount: { $sum: 1 },
        resp: { $first: "$$ROOT" },
      },
    },
    { $sort: { _id: 1 } },
    //             {$limit:1},
    //             {$project:{"_id": 0, "resp":1, "myCount": 1}},
  ])
    .then((mcqs) => {
      if (!mcqs) {
        return res.status(404).send({
          success: false,
          message: "Question not found with id " + req.params.contestId,
        });
      }
      if (!mcqs.length) throw "Each section must contain atleast question(s)!";

      let mcq = mcqs[0].resp;
      mcq.answer = null;
      mcq.questionNum = 1;
      mcq.sectionLen = mcqs[0].myCount;
      mcq.photo = mcq.photo
        ? mcq.photo.contentType
          ? mcq.photo.data.toString("base64")
          : ""
        : "";

      res.send(mcq);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Question not found with id " + req.params.contestId,
        });
      }
      return res.status(500).send({
        success: false,
        message:
          "Error retrieving MCQs from contest id " + req.params.contestId,
      });
    });
};

// Find a single question with a questionId
exports.findOne = (req, res) => {
  Mcq.find({ mcqId: req.params.mcqId })
    .then((mcq) => {
      if (!mcq) {
        return res.status(404).send({
          success: false,
          message: "Question not found with id " + req.params.mcqId,
        });
      }
      res.send(mcq);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Question not found with id " + req.params.mcqId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving question with id " + req.params.mcqId,
      });
    });
};

// Update a question identified by the questionId in the request
exports.update = (req, res) => {
  if (!req.params.mcqId) {
    return res.status(400).send({
      success: false,
      message: "content can not be empty",
    });
  }
  // Find question and update it with the request body
  Mcq.findOneAndUpdate(
    { mcqId: req.params.mcqId },
    {
      $set: {
        mcqName: req.body.mcqName,
        contestId: req.body.contestId,
        mcqDescriptionText: req.body.mcqDescriptionText,
        option1: req.body.op1,
        option2: req.body.op2,
        option3: req.body.op3,
        option4: req.body.op4,
        answer: req.body.answer,
        section: req.body.section,
      },
    },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
      // console.log(doc);
    }
  )
    .then((mcq) => {
      if (!mcq) {
        return res.status(404).send({
          success: false,
          message: "Question not found with id " + req.params.mcqId,
        });
      }
      if (req.files.photo) {
        updateImage(req.params.mcqId);
        return;
      }
      res.send(mcq);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Question not found with id " + req.params.mcqId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating Question with id " + req.params.mcqId,
      });
    });

  const updateImage = (mcqId) => {
    let file = req.files.photo;
    let uploadpath = `../Public/${mcqId}`;
    file.mv(uploadpath, async (err) => {
      if (err) {
        console.log(err);
        res.send("Error Occured!");
      } else {
        let file = fs.readFileSync(`../Public/${mcqId}`);
        var img = {
          data: file,
          contentType: "image/png",
        };
        const result = await uploadImage(mcqId, img);
        if (result) {
          res.redirect(clientAddress + "/error" + "?message=" + result);
        }
        fs.unlinkSync(`../Public/${mcqId}`, console.log(err));
      }
    });
  };

  const uploadImage = async (mcqId, img) => {
    return Mcq.findOneAndUpdate(
      { mcqId: mcqId },
      {
        $set: {
          photo: img,
        },
      },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log(err);
        }
      }
    )
      .then((mcq) => {
        if (!mcq) {
          return "mcq not found with mcqId  " + mcqId;
        }
        mcq._doc.photo = "base64 file";
        res.send(mcq._doc);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return "mcq not found with mcqId  " + mcqId;
        }
        return "Error updating mcq with id " + mcqId;
      });
  };
};

// Delete a question with the specified questionId in the request
exports.delete = (req, res) => {
  Mcq.findOneAndRemove({ mcqId: req.params.mcqId })
    .then((mcq) => {
      if (!mcq) {
        return res.status(404).send({
          success: false,
          message: "question not found with id " + req.params.mcqId,
        });
      }
      res.send({ message: "question deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "question not found with id " + req.params.mcqId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not delete question with id " + req.params.mcqId,
      });
    });
};

// generate score
exports.findAllMcqContest = (contestId, callback) => {
  Mcq.aggregate([
    { $match: { contestId: contestId } },
    { $group: { _id: "$section", books: { $push: "$$ROOT" } } },
    { $sort: { _id: 1 } },
  ])
    .then((mcq) => {
      if (!mcq) {
        return callback(
          "Question not found with Contest id " + req.params.contestId
        );
      }
      return callback(null, mcq);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return callback(
          "Question not found with Contest id " + req.params.contestId
        );
      }
      console.log(err);
      return callback(
        "Error retrieving question with Contest id " + req.params.contestId
      );
    });
};
