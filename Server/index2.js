const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const request = require('request');
const moment = require('moment');

let config = require('./util/config');
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
const submissions = require('./controllers/submission.controller.js');
const questions = require('./controllers/question.controller.js');
const participations = require('./controllers/participation.controller.js');
const contests = require('./controllers/contest.controller.js');



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

