const { writeFile } = require('fs');
const _ = require('lodash');
const productDetails = require('../data/productDetails.json');
const sponsoredProductDetails = require('../data/sponsoredProductsDetails.json');
let productReviews = require('../data/productReviews.json');

const getUser = function (req, res) {
  const { sessions, dataBase } = req.app.locals;
  const { id } = req.cookies;
  const user = dataBase[sessions.getSession(id)];
  return res.json(user || {});
};

const getProduct = function (req, res) {
  const { id } = req.params;
  const product = _.find(productDetails, { id });
  res.json(product);
};

const getProducts = function (req, res) {
  const { category } = req.params;
  const sponsoredProducts = _.filter(productDetails, { category: [category], isSponsored: true });
  const products = _.filter(productDetails, { category: [category], isSponsored: false });
  res.json([...sponsoredProducts, ...products]);
};

const getSponsoredProducts = function (req, res) {
  const { category } = req.params;
  res.json(sponsoredProductDetails[category]?.products ?? []);
};

const getSearchedProducts = function (req, res) {
  const { input } = req.query;
  const products = _.filter(productDetails, (product) =>
    _.includes(_.lowerCase(product.title), _.lowerCase(input))
  );
  const sponsoredProductsInSearchResult = _.filter(products, { isSponsored: true });
  const nonSponsoredProductsInSearchResult = _.filter(products, { isSponsored: false });
  res.json([...sponsoredProductsInSearchResult, ...nonSponsoredProductsInSearchResult]);
};

const getProductReviews = function (req, res) {
  const { id } = req.params;
  const reviews = _.filter(productReviews, { productId: id });
  res.json(reviews);
};

const addReview = function (req, res) {
  const { owner, productId, review } = req.body;
  productReviews = [
    {
      id: productReviews.length + 1,
      productId,
      owner,
      review,
      timeStamp: new Date(),
    },
    ...productReviews,
  ];
  writeFile(
    './data/productReviews.json',
    JSON.stringify(productReviews),
    (err) => {
      if (err) {
        console.log(err);
        return res.json([]);
      }
      return res.json(_.filter(productReviews, { productId }));
    }
  );
};

module.exports = {
  getUser,
  getProducts,
  getProduct,
  getSponsoredProducts,
  getSearchedProducts,
  getProductReviews,
  addReview,
};
