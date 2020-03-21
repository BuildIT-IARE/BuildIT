const Submission = require('../models/submission.model.js');
var moment = require('moment');
const fs = require('fs');
const path = require('path');
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
exports.genSource = (req, res) => {
    Submission.find({questionId: req.params.questionId})
    .then(submission => {
        if(submission.length === 0) {
            res.send("Submissions not found");
        }
        // result = [];
        // submission = submission[0];
        users = [];
        for(let i = 0; i < submission.length; i++){
            users.push(submission[i].username)
        }
        users = users.filter((a, b) => users.indexOf(a) === b);
        console.log(users);
        let dir = path.resolve('../Public/source_codes/' + req.params.questionId);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        users.forEach(user => {
            Submission.find({questionId: req.params.questionId, username: user, score: 100})
            .then(dup => {
                for(let s=0; s < dup.length; s++){
                    // result.push({questionId: dup[s].questionId, username: dup[s].username, languageId: dup[s].languageId, sourceCode: dup[s].sourceCode});
                    let l = dup.length - 1;
                    fs.writeFile('../Public/source_codes/'+dup[l].questionId +'/'+dup[l].username+'.txt',dup[l].sourceCode, (err) => {
                        if (err){
                           console.log("File gen failed!", err);   
                        }
                    })
                }
            }).catch(err => {
                console.log(err);
                if(err.kind === 'ObjectId') {
                    res.send("Submission not found with Id ");    
                }
                res.send("Error updating Submission with Id ");
            });
        })
        // console.log(result);
        res.send("Files Generation started!");
    }).catch(err => {
        console.log(err);
        if(err.kind === 'ObjectId') {
            res.send("Submission not found with Id ");    
        }
        res.send("Error updating Submission with Id ");
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