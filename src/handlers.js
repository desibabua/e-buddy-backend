const getUser = function (req, res) {
  const { sessions, dataBase } = req.app.locals;
  const name = dataBase[sessions.getName(req.cookies.id)];
  const user = name ? {name} : null;
  return res.json({user});
};

module.exports = { getUser };
