const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middleware");


exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Brand name should be between 3 and 32 characters long"),
    validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Brand name should be between 3 and 32 characters long"),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];