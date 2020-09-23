const getUser = function (req, res) {
  const { sessions, dataBase } = req.app.locals;
  const { id } = req.cookies;
  const name = dataBase[sessions.getSession(id)];
  const user = name ? { name } : null;
  return res.json({ user });
};

module.exports = { getUser };
