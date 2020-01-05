const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const request = require('request');
const moment = require('moment');

let config = require('./util/config2');
let middleware = require('./util/middleware.js');

// API Address
const localServer = config.localServer;

let apiAddress = config.apiAddress;
let timeOut = 3000;

if (localServer){
  apiAddress = config.localAPI;
  timeOut = 0;
}

console.log("Using API from url", apiAddress);

// INIT
const app = express();
app.options('*', cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);


// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


// CODE STARTS HERE

mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
moment.suppressDeprecationWarnings = true;

dbConfig = {
  url: config.dbURL
}
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Imports
const users = require('./controllers/user.controller.js');
const submissions = require('./controllers/submissionTut.controller.js');
const questions = require('./controllers/questionTut.controller.js');
const participations = require('./controllers/participationTut.controller.js');
const courses = require('./controllers/course.controller.js');



// Require course routes
require('./routes/course.route.js')(app);
// // // Require user routes
require('./routes/user.route.js')(app);
// Require question routes
require('./routes/questionTut.route.js')(app);
// Require submission routes
require('./routes/submissionTut.route.js')(app);
// Require participation routes
require('./routes/participationTut.route.js')(app);


app.post('/submissionValidation', middleware.checkToken, (req, res) => {
  questions.getTestCases(req, (err, testCases) => {
    if (err){
      res.status(404).send({message: "Question not found with id " + req.body.questionId});
  } else {
    if(localServer){
      postUrl = apiAddress + '/submissions/?wait=true';
    } else {
      postUrl = apiAddress + '/submissions';
    }
    let options1 = {
      method: 'post',
      body: {
        source_code: req.body.source_code,
        language_id: req.body.language_id,
        stdin: testcases.HI1,
        expected_output: testcases.HO1
      },
      json: true,
      url: postUrl
    };

    let options2 = {
      method: 'post',
      body: {
        source_code: req.body.source_code,
        language_id: req.body.language_id,
        stdin: testcases.HI2,
        expected_output: testcases.HO2
      },
      json: true,
      url: postUrl
    };

    let options3 = {
      method: 'post',
      body: {
        source_code: req.body.source_code,
        language_id: req.body.language_id,
        stdin: testcases.HI3,
        expected_output: testcases.HO3
      },
      json: true,
      url: postUrl
    };

    let result = {
      contestId: testcases.contestId,
      participationId: req.decoded.username + testcases.contestId
    };

    participations.findUserPart(result, (err, participation) => {
      if (err){
        res.status(404).send({message: err});
      }
      participation = participation[0];

      setTimeout(() => {
        request(options1, (err, resp, body) => {
          if (err) {
            res.status(404).send({message: err});
          }
          result.token1 = body.token;
          setTimeout(() => {
            request(options2, (err, resp, body) => {
              if (err) {
                res.status(404).send({message: err});
              }
              result.token2 = body.token;
              setTimeout(() => {
                request(options3, (err, resp, body) => {
                  if (err) {
                    res.status(404).send({message: err});
                  }
                  result.token3 = body.token;
                  if (result.token1 && result.token2 && result.token3){
                    option1 = {
                      url: apiAddress + '/submissions/' + result.token1,
                      method: 'get'
                    }
                    option2 = {
                      url: apiAddress + '/submissions/' + result.token2,
                      method: 'get'
                    }
                    option3 = {
                      url: apiAddress + '/submissions/' + result.token3,
                      method: 'get'
                    }
                    setTimeout(() => {
                      request(option1, (err, response, body) => {
                        if (err) {
                          res.status(404).send({message: err});
                          }
                          let data = JSON.parse(body);
                
                          let resp = data.status.description;
                          result.response1 = resp;
                          setTimeout(() => {
                            request(option2, (err, response, body) => {
                              if (err) {
                                res.status(404).send({message: err});
                                }
                                let data = JSON.parse(body);
                      
                                let resp = data.status.description;
                                result.response2 = resp;
                                setTimeout(() => {
                                  request(option3, (err, response, body) => {
                                    if (err) {
                                      res.status(404).send({message: err});
                                      }
                                      let data = JSON.parse(body);
                            
                                      let resp = data.status.description;
                                      result.response3 = resp;

                                      result.languageId = req.body.language_id;
                                      result.questionId = req.body.questionId;
                                      result.username = req.decoded.username;
                                      result.sourceCode = req.body.source_code;
                                      result.submissionToken = [result.token1, result.token2, result.token3];
                                      result.result = [result.response1, result.response2, result.response3];
                                      result.participationId = result.username + result.contestId;
                                      var testcasesPassed = 0;
                                      if (result.response1 === "Accepted"){
                                        testcasesPassed += 1;
                                      }
                                      if (result.response2 === "Accepted"){
                                        testcasesPassed += 1;
                                      }
                                      if (result.response3 === "Accepted"){
                                        testcasesPassed += 1;
                                      }
                                      if (testcasesPassed === 3){
                                        result.score = 100;
                                      } else if (testcasesPassed === 2) {
                                        result.score = 50;
                                      } else if (testcasesPassed === 1){
                                        result.score = 25;
                                      } else {
                                        result.score = 0;
                                      }

                                      // Add score to profile
                                  participations.acceptSubmission(result, (err, doc) =>{
                                    if (err){
                                      res.status(404).send({message: err});
                                    }
                                    // Create a submission
                                    submissions.create(req, result, (err, sub) => {
                                      if (err){
                                        res.status(404).send({message: err});
                                      } else {
                                        res.send(sub);
                                      }
                                    });
                                  });
                                  });
                                }, timeOut);
                            });
                          }, timeOut);
                      });
                    },timeOut);
                  } else {
                    res.status(500).send({message: "Server is Busy, try again later! or Check your code if any compilation errors."});
                  }
                });
              }, timeOut);
            });
          }, timeOut);
        });
      }, timeOut);
    });
  }
  });
});

app.listen(5003,()=>console.log('Server @ port 5003'));