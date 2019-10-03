const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const request = require('request');
const cookieParser = require('cookie-parser');
var path = require('path');


let serverRoute = 'http://localhost:5000';

const app = express();
app.options('*', cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(cookieParser());

app.use('/', express.static(__dirname + '/'));
app.use('/ide', express.static(path.resolve('../IDE')));


app.use('/contests', express.static(__dirname + '/'));
app.use('/contests/questions', express.static(__dirname + '/'));


app.get('/', async (req, res) => {
    res.render('home');
});
app.get('/index', async (req, res) => {
  res.render('home');
});
app.get('/home', async (req, res) => {
  res.render('home');
});
app.get('/about', async (req, res) => {
  res.render('about');
});

app.get('/contact', async (req, res) => {
  res.render('contact');
});

app.get('/login', async (req, res) => {
  res.render('login');
});

app.get('/questionadmin', async (req, res) => {
  res.render('questionAdminPanel');
});
app.get('/contestadmin', async (req, res) => {
  res.render('contestAdminPanel');
});
app.get('/admin', async (req, res) => {
  res.render('admin');
});

app.get('/ide/:questionId', async (req, res) => {
  let questionId = req.params.questionId;
  res.sendFile(path.resolve('../IDE/index.html'));
});


app.get('/contest', async (req, res) => {
  let options = {
    url : serverRoute + '/contests',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  
  request(options, function(err, response, body){
    // console.log(body);  
    res.render('contest', {data: body});
    
  });
});

app.get('/contests/:contestId', async (req, res) => {
  // Add participation
  let options1 = {
    url : serverRoute + '/participations',
    method: 'post',
    headers: {
      'authorization': req.cookies.token
    },
    body: {
      contestId: req.params.contestId 
    },
    json: true
  }
  request(options1, function(err, response, body){
    let options = {
      url : serverRoute + '/questions/contests/'+req.params.contestId,
      method: 'get',
      headers: {
        'authorization': req.cookies.token
      },
      json: true
    }
    request(options, function(err, response, body){
      res.cookie('contestId',req.params.contestId);
      // Add options and req here

      res.render('questions', {data: body});
    });
  });
});

app.get('/contests/questions/:questionId', async (req, res) => {
  let options = {
    url : serverRoute + '/questions/'+req.params.questionId,
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  request(options, function(err, response, body){
    res.render('questiondesc', {data: body});
  });
});


app.listen(3000);
console.log('Server @ port 3000');