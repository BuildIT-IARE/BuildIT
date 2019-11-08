const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const request = require('request');
const urlExists = require('url-exists');
const cookieParser = require('cookie-parser');
var path = require('path');

let config = require('../Server/util/config');


let serverRoute = config.serverAddress;
let clientRoute = config.clientAddress;

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
app.use('/admin', express.static(__dirname + '/'));



app.get('/', async (req, res) => {
  res.render('home', {imgUsername: req.cookies.username});
});
app.get('/index', async (req, res) => {
  res.render('home', {imgUsername: req.cookies.username});
});
app.get('/home', async (req, res) => {
  res.render('home', {imgUsername: req.cookies.username});
});
app.get('/about', async (req, res) => {
  res.render('about', {imgUsername: req.cookies.username});
});

app.get('/profile', async (req, res) => {
  let options = {
    url : serverRoute + '/users/' + req.cookies.username.toLowerCase(),
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  request(options, function(err, response, body){
    body.branchCaps = body.branch.toUpperCase();
    let branch = body.branch;
    let imageUrl = "http://13.233.239.42/iare/images/";
    let rollno =  req.cookies.username;
    let testUrl = imageUrl + branch + '/' + rollno + '.jpg';
    console.log(testUrl);
    urlExists(testUrl, function(err, exists) {
      if (exists){
        body.imgUrl = testUrl;
        console.log(body.imgUrl);
        res.render('profile', {data: body, imgUsername: req.cookies.username});
      } else {
        body.imgUrl = './images/defaultuser.png';
        console.log(body.imgUrl);
        res.render('profile', {data: body, imgUsername: req.cookies.username});
      }
    });
  });

});

app.get('/login', async (req, res) => {
  let url = {
    url: clientRoute
  }
  res.render('login', {data: url});
});

app.get('/admin/add/question', async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute
  };

  let options = {
    url : serverRoute + '/isAdmin',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  };

  request(options, function(err, response, body){
    if (body.success){
      res.render('questionadd', {data: url});
    } else {
      body.message = "Unauthorized access";
        res.render('error', {data: body, imgUsername: req.cookies.username})
    }    
  });
});

app.get('/admin/add/contest', async (req, res) => {

  let options = {
    url : serverRoute + '/isAdmin',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  
  request(options, function(err, response, body){
    let url = {
      url: clientRoute,
      serverurl: serverRoute
    }
    if (body.success){
      res.render('contestadd', {data: url});
    } else {
      body.message = "Unauthorized access";
        res.render('error', {data: body, imgUsername: req.cookies.username})
    }    
  });
});

app.get('/admin/update/question', async (req, res) => {
  let url = {
    url: clientRoute
  }
  let options = {
    url : serverRoute + '/isAdmin',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  
  request(options, function(err, response, body){
    if (body.success){
      res.render('questionupdate', {data: url});
    } else {
      body.message = "Unauthorized access";
        res.render('error', {data: body, imgUsername: req.cookies.username})
    }    
  });
});

app.get('/admin/update/contest', async (req, res) => {
  let url = {
    url: clientRoute,
    serverurl: serverRoute
  }
  let options = {
    url : serverRoute + '/isAdmin',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  
  request(options, function(err, response, body){
    if (body.success){
      res.render('contestupdate', {data: url});
    } else {
      body.message = "Unauthorized access";
        res.render('error', {data: body, imgUsername: req.cookies.username})
    }    
  });
});

app.get('/admin/manageusers', async (req, res) => {
  let options = {
    url : serverRoute + '/admin/users',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  request(options, function(err, response, body){
    
    body.url = clientRoute;
    body.serverurl = serverRoute;
    for (let i = 0; i < body.length; i++){
      if (!body[i].isVerified){
        body[i].color = "pink";
      }
    }
    res.render('manageusers', {data: body});
  });
});

app.get('/admin/deleteuser/:username', async (req, res) => {
  let options = {
    url : serverRoute + '/users/' + req.params.username,
    method: 'delete',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  request(options, function(err, response, body){
    res.redirect('/admin/manageusers');
  });
});

app.get('/admin/results', async (req, res) => {
  let options = {
    url : serverRoute + '/contests',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }

  request(options, function(err, response, body){
    body.posturl = clientRoute + '/admin/results/contest';
    body.url = clientRoute;
    body.method = "POST";
    res.render('dropdown', {data: body});
  });
});

app.post('/admin/results/contest', async (req, res) => {
  let options = {
    url : serverRoute + '/participations/all',
    method: 'post',
    body: {
      contestId: req.body.contestId
    },
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }

  request(options, function(err, response, bodyparticipation){

    let options = {
      url : serverRoute + '/questions/contests/'+ req.body.contestId,
      method: 'get',
      headers: {
        'authorization': req.cookies.token
      },
      json: true
    }

    request(options, function(err, response, bodyquestion){
      let url = {
        url: clientRoute
      }
      res.render('results', {data: url, datap: bodyparticipation, dataq: bodyquestion });
    });
    
  });
});

app.get('/contests/:contestId/leaderboard', async (req, res) => {
  let options = {
    url : serverRoute + '/participations/all',
    method: 'post',
    body: {
      contestId: req.params.contestId
    },
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  request(options, function(err, response, bodyparticipation){

    let options = {
      url : serverRoute + '/questions/contests/'+ req.params.contestId,
      method: 'get',
      headers: {
        'authorization': req.cookies.token
      },
      json: true
    }

    request(options, function(err, response, bodyquestion){
      let url = {
        url: clientRoute
      }
      res.render('results_public', {data: url, datap: bodyparticipation, dataq: bodyquestion });
    });
    
  });
});

app.get('/admin', async (req, res) => {

  let options = {
    url : serverRoute + '/isAdmin',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  
  request(options, function(err, response, body){
    let url = {
      url: clientRoute,
      serverurl: serverRoute
    }
    if (body.success){
      res.render('contestadd', {data: url});
    } else {
      body.message = "Unauthorized access";
        res.render('error', {data: body, imgUsername: req.cookies.username})
    }    
  });
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
    
    res.render('contest', {imgUsername: req.cookies.username, data: body});
    
  });
});

app.get('/contests/:contestId', async (req, res) => {
  // check if contest is open
  let options = {
    url : serverRoute + '/isOngoing',
    method: 'post',
    headers: {
      'authorization': req.cookies.token
    },
    body: {
      contestId: req.params.contestId 
    },
    json: true
  }
  request(options, function(err, response, body){
    if (body.success){
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
        // Get questions for contest
        request(options, function(err, response, body){
          res.cookie('contestId',req.params.contestId);
            let options3 ={
              url: serverRoute + '/participations/' + req.params.contestId,
              method: 'get',
              headers: {
                'authorization': req.cookies.token
              },
              json: true
          }
          // get participation details
          request(options3, function(err, response, bodytimer){
            bodytimer = bodytimer[0];
            let questions = [];
            let scores = [];
            for (let i = 0; i < body.length; i++){
              questions[i] = body[i].questionId;
            }
            for (let i = 0; i < questions.length; i++){
              let maxScore = 0;
              for(let j = 0; j < bodytimer.submissionResults.length; j++){
                if (bodytimer.submissionResults[j].questionId === questions[i]){
                  if (maxScore < bodytimer.submissionResults[j].score){
                    maxScore = bodytimer.submissionResults[j].score;
                  }
                }
              }
              scores[i] = maxScore;
            }
            for (let i = 0; i < body.length; i++){
              for(let j = 0; j < questions.length; j++){
                if (body[i].questionId === questions[j]){
                  body[i].score = scores[j];
                }
              }
            }
            for (let i = 0; i < body.length; i++){
              if (body[i].score === 100){
                body[i].color = "green";
              } else if (body[i].score === 50){
                body[i].color = "orange";
              } else if (body[i].score === 25) {
                body[i].color = "red";
              } else {
                body[i].color = "black";
              }
            }
            res.render('questions', {imgUsername: req.cookies.username, data: body, datatimer: bodytimer});
          });
        });
      });
    } else {
      res.render('error', {data: body, imgUsername: req.cookies.username});
    }
  });
});

app.post('/signup_', async (req, res) => {
  // res.render('/home');
  let options = {
    url : serverRoute + '/signup',
    method: 'post',
    body: {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      password2: req.body.password2,
      branch: req.body.branch
    },
    json: true
  }
  request(options, function(err, response, body){
        if (body.username && body.password){
          body.message = "Sign up successful, Account verification has been sent to your email";
        } 
        body.url = clientRoute;
        res.render('error', {data: body, imgUsername: req.cookies.username})

  });
});
app.post('/login_', async (req, res) => {
  let options = {
    url : serverRoute + '/login',
    method: 'post',
    body: {
      username: req.body.username,
      password: req.body.password
    },
    json: true
  }
  request(options, function(err, response, body){      
    if (body.success){
      res.cookie("token", body.token);
      res.cookie("username", body.username);
        if (body.admin){
          res.redirect('admin');
        }
        else{
          let url = {
            url: clientRoute
          };
          res.render('temp', {data: url, imgUsername: req.cookies.username});
        }
    } else {
      res.render('error', {data: body, imgUsername: req.cookies.username})
      }
        

  });
});

app.get('/logout', async (req, res) => {
  res.clearCookie('token');
  res.clearCookie('username');
  res.clearCookie('contestId');
  res.redirect('/home');
});

app.get('/error', async (req, res) => {
  res.render('error', {imgUsername: req.cookies.username});
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
    body.url = clientRoute;
    res.render('questiondesc', {imgUsername: req.cookies.username, data: body});
  });
});

app.get('/verify', async (req, res) => {
  // res.render('/home');
  let options = {
    url : serverRoute + '/verify',
    method: 'post',
    body: {
      email: req.query.email,
      token: req.query.token
    },
    json: true
  }
  request(options, function(err, response, body){
    res.render('error', {data: body, imgUsername: req.cookies.username});
  });
});

app.listen(4000);
console.log('Server @ port 4000');
