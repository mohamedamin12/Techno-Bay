const router = require("express").Router();
const brandController = require("../controllers/brands.controller");


const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validation/brandValidator");

router
  .route("/")
  .get( brandController.getAllBrands)
  .post(createBrandValidator, brandController.createBrand);

router
  .route("/:id")
  .get(getBrandValidator, brandController.getBrand)
  .put(updateBrandValidator, brandController.updateBrand)
  .delete(deleteBrandValidator, brandController.deleteBrand);

module.exports = router;