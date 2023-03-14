require('dotenv').config();

const path = require('path');
const express = require('express');

const cookieParser = require('cookie-parser');
const { Sessions } = require('../lib/sessions');
// const homeDetails = require('../data/home.json');
const homeAds = require('../data/sponsoredAds.json');

const { register, login, logout } = require('./oAuth');
const {
  getUser,
  getProducts,
  getProduct,
  getSponsoredBrands,
  getSearchedProducts,
  getProductReviews,
  addReview,
} = require('./handlers');

const app = express();

app.locals.dataBase = {};
app.locals.sessions = new Sessions();

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/api/login', login);
app.get('/api/logout', logout);
app.get('/api/register', register);
app.get('/api/home', (req, res) => res.json(homeAds));
app.get('/api/getUser', getUser);
app.get('/api/search', getSearchedProducts);
app.get('/api/product/:id', getProduct);
app.get('/api/products/:category', getProducts);
app.get('/api/sponsoredBrand/:category', getSponsoredBrands);
app.get('/api/review/:id', getProductReviews);


app.post('/api/addReview', addReview);
app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/index.html'));
});

module.exports = { app };
