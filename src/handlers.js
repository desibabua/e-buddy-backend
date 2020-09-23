const _ = require('lodash');
const productDetails = require('../data/productDetails.json');

const getUser = function (req, res) {
  const { sessions, dataBase } = req.app.locals;
  const { id } = req.cookies;
  const name = dataBase[sessions.getSession(id)];
  const user = name ? { name } : null;
  return res.json({ user });
};

const getProducts = function (req, res) {
  const { category } = req.params;
  const products = _.filter(productDetails, {category: [category]});
  res.json(products);
};

const getProduct = function (req, res) {
  const { id } = req.params;
  const product = _.find(productDetails, { id });
  res.json(product);
};

module.exports = { getUser, getProducts, getProduct };
