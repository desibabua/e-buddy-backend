const { writeFile } = require('fs');
const _ = require('lodash');
const productDetails = require('../data/productDetails.json');
const sponsoredBrands = require('../data/sponsoredBrands.json');
const sponsoredBanners = require('../data/sponsoredBanners.json');
const sponsoredProductDetails = require('../data/sponsoredProducts.json');

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

const mergeSponsoredProduct = function (products, sponsoredDetails) {

  sponsoredDetails.forEach(sponsoredProductPos => {
    const sponsoredProductCurrentPos = _.indexOf(products, { id: sponsoredProductPos.id })
    const sponsoredProduct = products.splice(sponsoredProductCurrentPos, 1)[0];
    products.splice((sponsoredProductPos.position - 1), 0, { ...sponsoredProduct, isSponsored: true })
  });

  return [...products];
}

const getProducts = function (req, res) {
  const { category } = req.params;
  const categoryProducts = _.filter(productDetails, { category: [category] });
  const sponsoredDetails = sponsoredProductDetails[category]?.products ?? [];

  res.json(mergeSponsoredProduct(categoryProducts, sponsoredDetails));
};

const getSponsoredBrands = function (req, res) {
  const { category } = req.params;

  const sponsoredBrandProducts = _.filter(productDetails, (product) => {
    return (sponsoredBrands[category]?.products ?? []).includes(product.id);
  });

  res.json(sponsoredBrandProducts);
};

const getSponsoredBanners = function (req, res) {
  const { category } = req.params;

  res.json({ sponsoredBanner: { ...sponsoredBanners[category] } });
};

const getSearchedProducts = function (req, res) {
  const { input } = req.query;

  const searchedProducts = _.filter(productDetails, (product) => {
    const searchInput = _.lowerCase(input);
    return _.includes(_.lowerCase(product.title), searchInput) || _.includes(product.category, searchInput)
  });

  const sponsoredDetails = sponsoredProductDetails[input]?.products ?? [];

  res.json(mergeSponsoredProduct(searchedProducts, sponsoredDetails))
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
  getSponsoredBrands,
  getSponsoredBanners,
  getSearchedProducts,
  getProductReviews,
  addReview,
};
