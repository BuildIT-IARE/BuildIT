const Submission = require('../models/submission.model.js');
var moment = require('moment');


// Create and Save a new submission
exports.create = (req, result, callback) => {
    // Validate request
    if(!result.submissionToken) {
        return callback("Submission token can not be empty", null);
    }

    if(!result.username) {
        return callback("username can not be empty", null);
    }
    let date = moment();
    // Create a Submission
    const submission = new Submission({
        questionId: result.questionId,
        username: result.username,
        languageId: result.languageId,
        sourceCode: result.sourceCode,
        result: result.result,
        score: result.score,
        submissionToken: result.submissionToken,
        submissionTime: moment(),
        participationId: result.participationId
      });
    
    if (submission.score === 100){
        submission.color = '#21BA45';
      } else if (submission.score < 100 && submission.score >= 25){
        submission.color = 'orange';
      } else {
        submission.color = 'red';
      }
    // SaveReg in the database
    submission.save()
    .then(data => {
        console.log(data);
        return callback(null, data);
    }).catch(err => {
        return callback("Error occurred while Submitting.", null);
    });
};

// Retrieve and return all submissions from the database.
exports.findAll = (req, res) => {
    Submission.find({questionId: req.params.questionId})
    .then(submission => {
        res.send(submission);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving submission."
        });
    });
};

exports.findUser = (req, res) => {
    Submission.find({username: req.params.username, questionId: req.params.questionId})
    .then(submission => {
        res.send(submission);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving submission."
        });
    });
};
exports.findContest = (req, res) => {
    Submission.find({contestId: req.body.contestId})
    .then(submission => {
        if(!submission) {
            res.send("Submissions not found");
        }
        result = [];
        submission = submission[0];
        users = [];
        submission.forEach(sub => {
            users.push(sub.username);
        });
        users = users.filter((a, b) => users.indexOf(a) === b);
        users.forEach(user => {
            Submission.find({contestId: req.body.contestId, username: user})
            .then(dup => {
                for(let s=0; s <= dup.length; s++){
                    result.push({questionId: dup[s].questionId, username: dup[s].username,languageId: dup[s].languageId, sourceCode: dup[s].sourceCode,score: dup[s].score});
                }
            })
        })
        res.send(result);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving submission."
        });
    });
};

// exports.findContestUser = (req, res) => {
//     Submission.find({contestId: req.body.contestId, username: req.body.username, questionId: req.body.questionId})
//     .then(submission => {
//         res.send(submission);
//     }).catch(err => {
//         res.status(500).send({
//             success: false,
//             message: err.message || "Some error occurred while retrieving submission."
//         });
//     });
// };