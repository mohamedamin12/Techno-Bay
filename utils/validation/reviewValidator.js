/* eslint-disable no-useless-catch */
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator.middleware');
const Review = require('../../models/review.model');

exports.createReviewValidator = [
  check('title').optional(),
  check('ratings')
    .notEmpty()
    .withMessage('ratings value required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings value must be between 1 to 5'),
  check('user').isMongoId().withMessage('Invalid Review id format'),
  check('product')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) =>
      // Check if logged user create review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          console.log(review);
          if (review) {
            return Promise.reject(
              new Error('You already created a review before')
            );
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom(async (val, { req }) => {
      try {
        const review = await Review.findById(val);
        if (!review) {
          throw new Error(`There is no review with id ${val}`);
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          console.log('User trying to update:', req.user._id);
          console.log('Review owner:', review.user._id.toString());
          throw new Error('You are not allowed to perform this action');
        }
      } catch (error) {
        throw error;
      }
    }),
  validatorMiddleware,
];


exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom(async (val, { req }) => {
      if (req.user.role === 'user') {
        try {
          const review = await Review.findById(val);
          if (!review) {
            throw new Error(`There is no review with id ${val}`);
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            throw new Error(`You are not allowed to perform this action`);
          }
        } catch (error) {
          throw error; 
        }
      }
      return true; 
    }),
  validatorMiddleware,
];