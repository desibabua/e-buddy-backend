const _ = require('lodash');
const productDetails = require('../data/productDetails.json');

const getUser = function (req, res) {
  const { sessions, dataBase } = req.app.locals;
  const { id } = req.cookies;
  const name = dataBase[sessions.getSession(id)];
  const user = name ? { name } : null;
  return res.json({ user });
};

const getProduct = function (req, res) {
  const { id } = req.params;
  const product = _.find(productDetails, { id });
  res.json(product);
};

const getProducts = function (req, res) {
  const { category } = req.params;
  const products = _.filter(productDetails, { category: [category] });
  res.json(products);
};

const getSearchedProducts = function (req, res) {
  const { input } = req.query;
  const products = _.filter(productDetails, (product) =>
    _.includes(_.lowerCase(product.title), _.lowerCase(input))
  );
  res.json(products);
};

module.exports = { getUser, getProducts, getProduct, getSearchedProducts };
