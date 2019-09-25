const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const request = require('request');
const jwt = require('jsonwebtoken');

// API Address
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


// CODE STARTS HERE

mongoose.Promise = global.Promise;
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

// Require allcontest routes
// require('./routes/allcontest.routes.js')(app);


// Require contest routes
require('./routes/contest.route.js')(app);
// Require user routes
require('./routes/user.route.js')(app);
// Require question routes
require('./routes/question.route.js')(app);


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



app.listen(5000,()=>console.log('Server @ port 5000'));