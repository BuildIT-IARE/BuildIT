const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const request = require('request');

let middleware = require('./util/middleware.js');

// API Address
const apiAddress = 'https://api.judge0.com/';
console.log("Using API from url", apiAddress);

// INIT
const app = express();
app.options('*', cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);


app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


// CODE STARTS HERE

mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);

dbConfig = {
  url: 'mongodb://localhost:27017/BuildIT'
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
const submissions = require('./controllers/submission.controller.js');
const question = require('./controllers/question.controller.js');
const participation = require('./controllers/participation.controller.js');
const contest = require('./controllers/contest.controller.js');



// Require contest routes
require('./routes/contest.route.js')(app);
// Require user routes
require('./routes/user.route.js')(app);
// Require question routes
require('./routes/question.route.js')(app);
// Require submission routes
require('./routes/submission.route.js')(app);
// Require participation routes
require('./routes/participation.route.js')(app);


// Examples
app.get('/testGet', async (req, res) => {
    console.log("Tested Get");
    res.json({status: "working"});
  
});

app.post('/testPost', async (req, res) => {
    // req.body.userId = req.cookies.userId;
    console.log('request body');
    console.log(req.body);
    res.json(req.body);
});

// Main Routes

app.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.send("Add redirect here");
});

app.post('/validateSubmission', middleware.checkToken, async (req, res)=> {
  question.getTestCases(req, (err, testcases) => {
    if (err){
        res.status(404).send({message: "Question not found with id " + req.body.questionId});
    } else {
      let options1 = {
        method: 'post',
        body: {
          source_code: req.body.source_code,
          language_id: req.body.language_id,
          stdin: testcases.HI1,
          expected_output: testcases.HO1
        },
        json: true,
        url: apiAddress + '/submissions'
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
        url: apiAddress + '/submissions'
      };

      let options3 = {
        method: 'post',
        body: {
          source_code: req.body.source_code,
          language_id: req.body.language_id,
          stdin: testcases.HI3,
          expected_output: testcases.HO3,
          base64_encoded: true
        },
        json: true,
        url: apiAddress + '/submissions'
      };
      
      let result = {};
      request(options1, function (err, response, body) {
        if (err) {
          res.send(err);
        }
        result.test1 = body.token;
        request(options2, function (err, response, body) {
          if (err) {
            res.send(err);
          }
          result.test2 = body.token;
          request(options3, function (err, response, body) {
            if (err) {
              res.send(err);
            }
            result.test3 = body.token;
            console.log(result);



          });  
        });
      });


    }
  });
});

app.listen(5000,()=>console.log('Server @ port 5000'));