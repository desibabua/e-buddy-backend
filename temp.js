const express = require('express');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());

const CLIENT_ID = '9b40f07377edc5d94342';
const CLIENT_SECRET = '66474a9f41744f70851844f5bd785f62c5aa135f';
const REDIRECT_URI_LOGIN = 'http://localhost:3000/loggedIn/afterlogin.html';
const REDIRECT_URI_SIGNUP = 'http://localhost:3000/signedUp/afterSignUp.html';

//sigUp => redirect github --> authenticate button click --> code --> exchange with access token --> github/user header{ access token}
//sigIn => redirect github --> code --> exchange with access token --> github/user header{ access token}

//---------------------------------------------------------

const dataBase = {};
class Cookies {
  constructor() {
    this.data = {};
    this.lastId = 0;
  }

  setCookie(name) {
    this.lastId++;
    this.data[this.lastId] = name;
    return this.lastId;
  }

  getName(id) {
    return this.data[id];
  }
}
const cookies = new Cookies();

const getAccessToken = (code) => {
  return fetch('https://github.com/login/oauth/access_token', {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`,
  }).then((x) => x.json());
};

const getUserDetails = async (code) => {
  const { access_token } = await getAccessToken(code);
  return fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${access_token}`,
    },
  }).then((x) => x.json());
};

//----------------------------------------------------------

app.use((req, res, next) => {
  console.log(res.statusCode, req.url, req.method, req.body);
  next();
});

app.use(cookieParser());
app.use(express.static('public'));

app.get('/logIn', (req, res) => {
  const { id } = req.cookies;
  if (dataBase[cookies.getName(id)]) {
    return res.redirect(
      302,
      `https://github.com/login/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_LOGIN}`
    );
  }
  res.end('do signUp first');
});

app.get('/signUp', (req, res) => {
  res.redirect(
    302,
    `https://github.com/login/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_SIGNUP}`
  );
});

app.get('/loggedIn/:page', (req, res) => {
  res.redirect(`http://localhost:3000/${req.params.page}`);
});

app.get('/signedUp/:page', (req, res) => {
  getUserDetails(req.query.code)
    .then((details) => {
      console.log(details);
      return details;
    })
    .then(({ login, name, location, company }) => {
      if (dataBase[login]) {
        return res.end('do logIn');
      }
      dataBase[login] = {
        userName: name,
        location: location,
        company: company,
      };
      res.cookie('id', cookies.setCookie(login));
      res.redirect(`http://localhost:3000/${req.params.page}`);
    });
});

app.listen(3000, () => console.log('listening on 3000'));
