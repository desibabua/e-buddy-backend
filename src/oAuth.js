const fetch = require('node-fetch');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, HOME_URL } = process.env;

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

const register = function (req, res) {
  const { dataBase, sessions } = req.app.locals;
  getUserDetails(req.query.code).then(({ login, name }) => {
    if (!dataBase[login]) {
      dataBase[login] = { name };
    }
    res.cookie('id', sessions.setSession(login));
    res.redirect(HOME_URL);
  });
};

const login = function (req, res) {
  const url = `https://github.com/login/oauth/authorize?response_type=code&client_id=${CLIENT_ID}`;
  const redirection_url = `&redirect_uri=${REDIRECT_URI}`;
  res.redirect(url + redirection_url);
};

const logout = function (req, res) {
  const { sessions } = req.app.locals;
  const { id } = req.cookies;
  sessions.deleteSession(id) && res.clearCookie(id);
  res.redirect(HOME_URL);
};

module.exports = { register, login, logout };
