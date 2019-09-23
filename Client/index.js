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
app.get('/', async (req, res) => {
  res.redirect('home');
});
app.get('/about', async (req, res) => {
  res.render('about');
});
app.get('/blog', async (req, res) => {
  res.render('blog');
});
app.get('/portfolio', async (req, res) => {
  res.render('portfolio');
});
app.get('/contact', async (req, res) => {
  res.render('contact');
});


app.listen(process.env.PORT || 3000);
console.log('PORT: ', process.env.PORT, 'Or 3000');