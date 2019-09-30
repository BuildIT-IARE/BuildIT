const Question = require('../models/question.model.js');
const Contest = require('../models/contest.model.js');

// const Base64 = require('js-base64').Base64;
// Create and Save a new question
exports.create = (req, res) => {
    // Validate request
    if(!req.body.questionId) {
        return res.status(400).send({
            message: "QuestionId can not be empty"
        });
    }

    if(!req.body.questionName) {
        return res.status(400).send({
            message: "Question name can not be empty"
        });
    }

    // Create a Question
    const question = new Question({
    questionId: req.body.questionId,
    questionName: req.body.questionName,
    contestId: req.body.contestId,
    questionDescriptionText: req.body.questionDescriptionText, 
    questionInputText: req.body.questionInputText,
    questionOutputText: req.body.questionOutputText,
    questionExampleInput1: req.body.questionExampleInput1,
    questionExampleOutput1: req.body.questionExampleOutput1,
    questionExampleInput2: req.body.questionExampleInput2,
    questionExampleOutput2: req.body.questionExampleOutput2,
    questionExampleInput3: req.body.questionExampleInput3,
    questionExampleOutput3: req.body.questionExampleOutput3,
    questionHiddenInput1: req.body.questionHiddenInput1,
    questionHiddenInput2: req.body.questionHiddenInput2,
    questionHiddenInput3: req.body.questionHiddenInput3,
    questionHiddenOutput1: req.body.questionHiddenOutput1,
    questionHiddenOutput2: req.body.questionHiddenOutput2,
    questionHiddenOutput3: req.body.questionHiddenOutput3,
    questionExplanation: req.body.questionExplanation,
    author: req.body.author,
    editorial: req.body.editorial,
    difficulty: req.body.difficulty,
    published: req.body.published
    });

    // Save Question in the database
    question.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Question."
        });
    });
};

// Retrieve and return all questions from the database.
exports.findAll = (req, res) => {
    Question.find()
    .then(questions => {
        res.send(questions);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving questions."
        });
    });
};

// Find a single question with a questionId
exports.findOne = (req, res) => {
    Question.find({questionId: req.params.questionId})
    .then(question => {
        if(!question) {
            return res.status(404).send({
                message: "Question not found with id " + req.params.questionId
            });            
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving question with id " + req.params.questionId
        });
    });
};

// Find testcases with questionId
exports.getTestCases = (req, callback) => {
    Question.find({questionId: req.body.questionId})
    .then(question => {
        if(!question) {
            return callback("Couldn't find question", null);            
        }
        Contest.find({contestId: question.contestId, contestDate: Date.now()})
        .then(contest => {
            question = question[0];
            // let h1 = question.questionHiddenInput1.toString();
            // console.log("h1");
            // console.log(h1);
            // h2 = Base64.encode(h1);
            testcases = {
                contestId: question.contestId,
                HI1: question.questionHiddenInput1,
                HI2: question.questionHiddenInput2,
                HI3: question.questionHiddenInput3,
                HO1: question.questionHiddenOutput1,
                HO2: question.questionHiddenOutput2,
                HO3: question.questionHiddenOutput3
            }
            return callback(null, testcases);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return callback("Couldn't find question, caught exception", null);                 
        }
        return callback("Error retrieving data", null);        
    });
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return callback("Couldn't find question, caught exception", null);                 
            }
            return callback("Error retrieving data", null); 
        });
        
};


// Update a question identified by the questionId in the request
exports.update = (req, res) => {
    if(!req.body.questionId) {
        return res.status(400).send({
            message: "content can not be empty"
        });
    }

    // Find question and update it with the request body
    Question.findOneAndUpdate({questionId: req.params.questionId}, {$set:{
        questionId: req.body.questionId,
        questionName: req.body.questionName,
        contestId: req.body.contestId,
        questionDescriptionText: req.body.questionDescriptionText, 
        questionInputText: req.body.questionInputText,
        questionOutputText: req.body.questionOutputText,
        questionExampleInput1: req.body.questionExampleInput1,
        questionExampleOutput1: req.body.questionExampleOutput1,
        questionExampleInput2: req.body.questionExampleInput2,
        questionExampleOutput2: req.body.questionExampleOutput2,
        questionExampleInput3: req.body.questionExampleInput3,
        questionExampleOutput3: req.body.questionExampleOutput3,
        questionHiddenInput1: req.body.questionHiddenInput1,
        questionHiddenInput2: req.body.questionHiddenInput2,
        questionHiddenInput3: req.body.questionHiddenInput3,
        questionHiddenOutput1: req.body.questionHiddenOutput1,
        questionHiddenOutput2: req.body.questionHiddenOutput2,
        questionHiddenOutput3: req.body.questionHiddenOutput3,
        questionExplanation: req.body.questionExplanation,
        author: req.body.author,
        editorial: req.body.editorial,
        difficulty: req.body.difficulty,
        published: req.body.published
      }}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
      })
    .then(question => {
        if(!question) {
            return res.status(404).send({
                message: "Question not found with id " + req.params.questionId
            });
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            message: "Error updating Question with id " + req.params.questionId
        });
    });
};

// Publish question
exports.publish = (req, res) => {
    if(!req.body.questionId) {
        return res.status(400).send({
            message: "content can not be empty"
        });
    }

    // Find question and update it with the request body
    Question.findOneAndUpdate({questionId: req.params.questionId}, {$set:{
        published: "true"
      }}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
      })
    .then(question => {
        if(!question) {
            return res.status(404).send({
                message: "Question not found with id " + req.params.questionId
            });
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            message: "Error updating Question with id " + req.params.questionId
        });
    });
};

// Archive question
exports.archive = (req, res) => {
    if(!req.body.questionId) {
        return res.status(400).send({
            message: "content can not be empty"
        });
    }

    // Find question and update it with the request body
    Question.findOneAndUpdate({questionId: req.params.questionId}, {$set:{
        published: "false"
      }}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
      })
    .then(question => {
        if(!question) {
            return res.status(404).send({
                message: "Question not found with id " + req.params.questionId
            });
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            message: "Error updating Question with id " + req.params.questionId
        });
    });
};

// Delete a question with the specified questionId in the request
exports.delete = (req, res) => {
    Question.findOneAndRemove({questionId: req.params.questionId})
    .then(question => {
        if(!question) {
            return res.status(404).send({
                message: "question not found with id " + req.params.questionId
            });
        }
        res.send({message: "question deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            message: "Could not delete question with id " + req.params.questionId
        });
    });
};

exports.findAllContest = (req, res) => {
    Question.find({contestId: req.params.contestId})
    .then(question => {
        if(!question) {
            return res.status(404).send({
                message: "Question not found with id " + req.params.questionId
            });            
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving question with id " + req.params.questionId
        });
    });
};