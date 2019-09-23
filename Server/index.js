const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const request = require('request');
const cookieParser = require('cookie-parser');

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
res.send(`Hello, ${req.body.username} `)

});



app.listen(4321,()=>console.log('Server @ port 4321'));