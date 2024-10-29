const router = require("express").Router();
const categoryController = require("../controllers/categories.controller");

const {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validation/categoryValidator");

router
  .route("/")
  .post(createCategoryValidator,categoryController.createCategory)
  .get(categoryController.getCategories);

router
  .route("/:id")
  .get(getCategoryValidator,categoryController.getCategoryById)
  .put(updateCategoryValidator,categoryController.updateCategory)
  .delete(deleteCategoryValidator,categoryController.deleteCategory);

module.exports = router;
