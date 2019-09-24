const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const request = require('request');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const apiAddress = 'https://api.judge0.com/';
console.log("Using API from url", apiAddress);

// INIT
const app = express();
app.options('*', cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
// MONGOOSE SCHEMA
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  rollno: String,
  password: String,
  name: String,
  contests: [{
    contestId: String,
    submissions: [{submissionId: String}],
    results: [{status: String}]
  }]

});

var contestSchema = new Schema({
  contestId: String,
  contestName: String,
  contestDate: String,
  contestDuration: Number,
  contestStartTime: String,
  questions: [{
    questionId: String,
    questionName: String,
    questionDescriptionText: String, 
    questionInputText: String,
    questionOutputText: String,
    questionExampleInput: String,
    questionExampleOutput: String,
    questionHiddenInput1: String,
    questionHiddenInput2: String,
    questionHiddenInput3: String,
    questionHiddenOutput1: String,
    questionHiddenOutput2: String,
    questionHiddenOutput3: String,
    questionExplanation: String
  }]
});

var allContestSchema = new Schema({
  contestId: String,
  contestName: String
});

var user = mongoose.model('User', userSchema);
var contest = mongoose.model('Contest', contestSchema);
var allContest = mongoose.model('AllContest', allContestSchema);


// CODE STARTS HERE






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
  
// Routes

app.post('/login', async(req, res) => {
console.log("Login by ", req.body.username);
res.send(`Hello, ${req.body.username} `);
});



app.listen(4321,()=>console.log('Server @ port 4321'));