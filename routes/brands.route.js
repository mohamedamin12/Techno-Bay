const router = require("express").Router();
const brandController = require("../controllers/brands.controller");
const { allowedTo, protect } = require('../middlewares/auth.middleware');


const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validation/brandValidator");

router
  .route("/")
  .get(brandController.getAllBrands)
  .post(protect, allowedTo('admin', 'manager'), createBrandValidator, brandController.createBrand);

router
  .route("/:id")
  .get(getBrandValidator, brandController.getBrand)
  .put(protect, allowedTo('admin', 'manager'), updateBrandValidator, brandController.updateBrand)
  .delete(protect, allowedTo('admin', 'manager'), deleteBrandValidator, brandController.deleteBrand);

module.exports = router;