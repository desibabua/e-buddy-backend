const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/', (req, res) => res.end('hello'));

module.exports = { app };
