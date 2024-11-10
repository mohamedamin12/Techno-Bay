const router = require("express").Router();
const upload = require("../middlewares/photoUpload.middleware");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validation/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");

const reviewsRoute = require('./review.route');

router.use('/:productId/reviews', reviewsRoute);

router
  .route("/")
  .get(getProducts)
  .post(upload.array("images", 5), createProductValidator, createProduct);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
