const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const request = require('request');
const cookieParser = require('cookie-parser');

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
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use('/', express.static(__dirname + '/'));

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
app.get('/contest', async (req, res) => {
  res.render('contest');
});
app.get('/blog-single', async (req, res) => {
  res.render('blog-single');
});
app.get('/contact', async (req, res) => {
  res.render('contact');
});


app.listen(process.env.PORT || 3000);
console.log('PORT: ', process.env.PORT, 'Or 3000');