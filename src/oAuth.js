const fetch = require('node-fetch');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

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

const authenticate = function (req, res) {
  const { page } = req.params;
  const url = `https://github.com/login/oauth/authorize?response_type=code&client_id=${CLIENT_ID}`;
  const redirection_url = `&redirect_uri=${REDIRECT_URI + page}`;
  res.redirect(url + redirection_url);
};

const login = function (req, res) {
  const { dataBase, sessions } = req.app.locals;
  getUserDetails(req.query.code).then(({ login, name }) => {
    if (dataBase[login]) {
      return res.end('do logIn');
    }
    dataBase[login] = { name };
    res.cookie('id', sessions.setCookie(login));
    res.redirect(`http://localhost:3000/`);
  });
};

module.exports = { authenticate, login };
