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

const { allowedTo, protect } = require('../middlewares/auth.middleware');


const reviewsRoute = require('./review.route');

router.use('/:productId/reviews', reviewsRoute);

router
  .route("/")
  .get(getProducts)
  .post(protect, allowedTo("admin", "manager"), upload.array("images", 5), createProductValidator, createProduct);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(protect, allowedTo("admin", "manager"), updateProductValidator, updateProduct)
  .delete(protect, allowedTo("admin", "manager"), deleteProductValidator, deleteProduct);

module.exports = router;
