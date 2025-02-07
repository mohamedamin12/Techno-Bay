const router = require("express").Router();
const categoryController = require("../controllers/categories.controller");

const {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validation/categoryValidator");

const { allowedTo, protect } = require('../middlewares/auth.middleware');


router
  .route("/")
  .post(protect, allowedTo("admin", "manager"), createCategoryValidator, categoryController.createCategory)
  .get(categoryController.getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, categoryController.getCategoryById)
  .put(protect, allowedTo("admin", "manager"), updateCategoryValidator, categoryController.updateCategory)
  .delete(protect, allowedTo("admin", "manager"), deleteCategoryValidator, categoryController.deleteCategory);

module.exports = router;
