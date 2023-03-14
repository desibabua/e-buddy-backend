const { writeFile } = require('fs');
const _ = require('lodash');
const productDetails = require('../data/productDetails.json');
const sponsoredBrands = require('../data/sponsoredBrands.json');
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

const mergeSponsoredProduct = function (nonSponsoredProducts, sponsoredProducts, sponsoredDetails) {
  const products = [...nonSponsoredProducts];

  sponsoredDetails.forEach(sponsoredProductPos => {
    const sponsoredProduct = _.find(sponsoredProducts, { id: sponsoredProductPos.id })
    products.splice((sponsoredProductPos.position - 1), 0, sponsoredProduct)
  });

  return products;
}

const getProducts = function (req, res) {
  const { category } = req.params;
  const sponsoredProducts = _.filter(productDetails, { category: [category], isSponsored: true });
  const products = _.filter(productDetails, { category: [category], isSponsored: false });

  const sponsoredDetails = sponsoredProductDetails[category]?.products ?? [];

  // const allProducts = sponsoredDetails.length > 0
  //   ? mergeSponsoredProduct(products, sponsoredProducts, sponsoredDetails)
  //   : _.filter(productDetails, { category: [category] });

  res.json(mergeSponsoredProduct(products, sponsoredProducts, sponsoredDetails));
};

const getSponsoredBrands = function (req, res) {
  const { category } = req.params;
  const sponsoredBrandProducts = _.filter(productDetails, (product) => {
    return (sponsoredBrands[category]?.products ?? []).includes(product.id);
  });
  res.json(sponsoredBrandProducts);
};

const getSearchedProducts = function (req, res) {
  const { input } = req.query;
  const products = _.filter(productDetails, (product) =>
    _.includes(_.lowerCase(product.title), _.lowerCase(input))
  );
  const sponsoredProductsInSearchResult = _.filter(products, { isSponsored: true });
  const nonSponsoredProductsInSearchResult = _.filter(products, { isSponsored: false });
  const sponsoredDetails = sponsoredProductDetails[input]?.products ?? [];

  res.json(mergeSponsoredProduct(nonSponsoredProductsInSearchResult, sponsoredProductsInSearchResult, sponsoredDetails))
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
  getSearchedProducts,
  getProductReviews,
  addReview,
};
