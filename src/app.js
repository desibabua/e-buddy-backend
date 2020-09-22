require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const { Sessions } = require('../lib/sessions');
const homeDetails = require('../data/home.json');

const { authenticate, login } = require('./oAuth');
const { getUser} = require('./handlers');

const app = express();

app.locals.dataBase = {};
app.locals.sessions = new Sessions();

app.use(cookieParser());
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/authenticate/:page', authenticate);
app.get('/api/login', login);
app.get('/api/home', (req, res) => res.json(homeDetails));
app.get('/getUser', getUser);

module.exports = { app };
