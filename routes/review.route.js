const router = require('express').Router({mergeParams: true});


const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require('../utils/validation/reviewValidator');

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  setProductIdAndUserIdToBody
} = require('../controllers/review.controller');

const { allowedTo, protect } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(getReviews)
  .post(
    protect,
    allowedTo('user'),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );

router
  .route('/:id')
  .get(getReviewValidator,getReview)
  .put(
    protect,
    allowedTo('user'),
    updateReviewValidator,
    updateReview
  )

  .delete(
    protect,
    allowedTo('user', 'admin'),
    deleteReviewValidator,
    deleteReview
  );

  module.exports = router;