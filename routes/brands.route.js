const router = require("express").Router();
const brandController = require("../controllers/brands.controller");
const upload = require("../middlewares/photoUpload.middleware");


const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validation/brandValidator");

router
  .route("/")
  .get( brandController.getAllBrands)
  .post(upload.single("image") ,createBrandValidator, brandController.createBrand);

router
  .route("/:id")
  .get(getBrandValidator, brandController.getBrand)
  .put(updateBrandValidator, brandController.updateBrand)
  .delete(deleteBrandValidator, brandController.deleteBrand);

module.exports = router;