const Question = require('../models/question.model.js');
const inarray = require('inarray');

// const Base64 = require('js-base64').Base64;
// Create and Save a new question
exports.create = (req, res) => {
    // Validate request
    if(req.files.upfile){
        var file = req.files.upfile,
          name = file.name,
          type = file.mimetype;
        var uploadpath = '../quesxlsx'+name;
        file.mv(uploadpath,function(err){
          if(err){
            console.log("File Upload Failed",name,err);
            res.send("Error Occured!")
          }
          else {
            let wb = xlsx.readFile('../quesxlsx'+name);
            let ws = wb.Sheets["Sheet1"];
            let data = xlsx.utils.sheet_to_json(ws);
            let question;
            for(let i = 0; i < data.length; i++){
                 question = new Question({
                    questionId: data[i].questionId,
                    questionName: data[i].questionName,
                    contestId: data[i].contestId,
                    questionDescriptionText: data[i].questionDescriptionText, 
                    questionInputText: data[i].questionInputText,
                    questionOutputText: data[i].questionOutputText,
                    questionExampleInput1: data[i].questionExampleInput1,
                    questionExampleOutput1: data[i].questionExampleOutput1,
                    questionExampleInput2: data[i].questionExampleInput2,
                    questionExampleOutput2: data[i].questionExampleOutput2,
                    questionExampleInput3: data[i].questionExampleInput3,
                    questionExampleOutput3: data[i].questionExampleOutput3,
                    questionHiddenInput1: data[i].questionHiddenInput1,
                    questionHiddenInput2: data[i].questionHiddenInput2,
                    questionHiddenInput3: data[i].questionHiddenInput3,
                    questionHiddenOutput1: data[i].questionHiddenOutput1,
                    questionHiddenOutput2: data[i].questionHiddenOutput2,
                    questionHiddenOutput3: data[i].questionHiddenOutput3,
                    questionExplanation: data[i].questionExplanation,
                    author: data[i].author,
                    editorial: data[i].editorial,
                    difficulty: data[i].difficulty,
                    language: data[i].language,
                    conceptLevel: data[i].conceptLevel
                    });
                
                    // Save Question in the database
                    question.save()
            }
            res.send('Done! Uploading files');
          }
        });
      }else {
        res.send("No File selected !");
        res.end();
      };

    // Create a Question

    // .then(data => {
    //     res.send(data);
    // }).catch(err => {
    //     res.status(500).send({
    //         success: false,
    //         message: err.message || "Some error occurred while creating the Question."
    //     });
    // });
};

exports.createTutorials = (req, res) => {
     // Validate request
     if(req.files.upfile){
        var file = req.files.upfile,
          name = file.name,
          type = file.mimetype;
        var uploadpath = '../quesTutxlsx'+name;
        file.mv(uploadpath,function(err){
          if(err){
            console.log("File Upload Failed",name,err);
            res.send("Error Occured!")
          }
          else {
            let wb = xlsx.readFile('../quesTutxlsx'+name);
            let ws = wb.Sheets["Sheet1"];
            let data = xlsx.utils.sheet_to_json(ws);
            let question;
            for(let i = 0; i < data.length; i++){
                question = new Question({
                    questionId: data[i].questionId,
                    questionName: data[i].questionName,
                    contestId: data[i].contestId,
                    questionDescriptionText: data[i].questionDescriptionText, 
                    questionInputText: data[i].questionInputText,
                    questionOutputText: data[i].questionOutputText,
                    questionExampleInput1: data[i].questionExampleInput1,
                    questionExampleOutput1: data[i].questionExampleOutput1,
                    questionExampleInput2: data[i].questionExampleInput2,
                    questionExampleOutput2: data[i].questionExampleOutput2,
                    questionExampleInput3: data[i].questionExampleInput3,
                    questionExampleOutput3: data[i].questionExampleOutput3,
                    questionHiddenInput1: data[i].questionHiddenInput1,
                    questionHiddenInput2: data[i].questionHiddenInput2,
                    questionHiddenInput3: data[i].questionHiddenInput3,
                    questionHiddenOutput1: data[i].questionHiddenOutput1,
                    questionHiddenOutput2: data[i].questionHiddenOutput2,
                    questionHiddenOutput3: data[i].questionHiddenOutput3,
                    questionExplanation: data[i].questionExplanation,
                    author: data[i].author,
                    editorial: data[i].editorial,
                    difficulty: data[i].difficulty,
                    language: data[i].language,
                    conceptLevel: data[i].conceptLevel,
                    courseId: ["IARE_PY", "IARE_C", "IARE_CPP", "IARE_JAVA"]
                    });
                
                    // Save Question in the database
                    question.save()
            }
            res.send('Done! Uploading files');
          }
        });
      }else {
        res.send("No File selected !");
        res.end();
      };
};

// Retrieve and return all questions from the database.
exports.findAll = (req, res) => {
    Question.find()
    .then(questions => {
        res.send(questions);
    }).catch(err => {
        res.status(500).send({
            success: false,
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
                success: false,
                message: "Question not found with id " + req.params.questionId
            });            
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            success: false,
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
            HO3: question.questionHiddenOutput3,
            difficulty: question.difficulty,
            language: question.language,
            courseId: question.courseId,
            conceptLevel: question.conceptLevel
        }
        return callback(null, testcases);
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
            success: false,
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
        language: req.body.language,
        conceptLevel: req.body.conceptLevel
      }}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
      })
    .then(question => {
        if(!question) {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            success: false,
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
                success: false,
                message: "question not found with id " + req.params.questionId
            });
        }
        res.send({message: "question deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                success: false,
                message: "question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Could not delete question with id " + req.params.questionId
        });
    });
};

exports.findAllContest = (req, res) => {
    Question.find({contestId: req.params.contestId})
    .then(question => {
        if(!question) {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });            
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving question with id " + req.params.questionId
        });
    });
};

exports.findAllCourse = (req, res) => {
    Question.find({courseId: req.params.courseId})
    .then(question => {
        if(!question) {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });            
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving question with id " + req.params.questionId
        });
    });
};

exports.findAllCourseDifficulty = (req, res) => {
    Question.find({courseId: req.params.courseId, difficulty: req.params.difficulty})
    .then(question => {
        if(!question) {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });            
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving question with id " + req.params.questionId
        });
    });
};

exports.findAllCourseConceptWise = (req, res) => {
    console.log(req.params);
    Question.find({courseId: req.params.courseId, difficulty: req.params.difficulty, conceptLevel: req.params.conceptLevel})
    .then(question => {
        if(!question) {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });            
        }
        res.send(question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.params.questionId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving question with id " + req.params.questionId
        });
    });
};

exports.getAllQuestions = (req, callback) => {
    Question.find({contestId: req.cookies.contestId})
    .then(question => {
        if(!question) {
            return callback("Questions not found ", null);
        }
        return callback(null, question);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return callback("Questions not found ", null);
        }
        return callback("Error retrieving questions", null);
    });
};

exports.merge = (req ,res) => {
    Question.find({questionId: req.body.questionId})
    .then(question =>{
        if(!question) {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.body.questionId
            }); 
        }
        question = question[0];
        console.log(question);
        if (!req.body.courseId){
            return res.status(404).send({
                success: false,
                message: "Enter a valid courseId"
            }); 
        }
        let exists = inarray(question.courseId, req.body.courseId);
        if(!exists){
            question.courseId.push(req.body.courseId);
            question.save();
            res.send(question);
        }
        else{
            return res.send(question);
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Question not found with id " + req.body.questionId
            });                
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving question with id " + req.body.questionId
        });
    });
}
