const asyncHandler = require("express-async-handler");
const Review = require("../models/review.model");
const ApiError = require("../utils/apiError");

const {
  buildFilter,
  buildSort,
  buildFields,
  buildKeywordSearch,
} = require("../utils/apiFeatures");

// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

/**
 *  @desc    create a new review
 *  @route   /api/reviews
 *  @method  POST
 *  @access  private (logged in user)
 */
exports.createReview = asyncHandler(async (req, res) => {
  const { title , ratings , product , user } = req.body;
  const review = await Review.create({ title, ratings , product, user });
  res
    .status(201)
    .json({ message: "Review created successfully", data: review });
});

// Nested route (Create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

/**
 *  @desc    get all review
 *  @route   /api/reviews
 *  @method  GET
 *  @access  public (logged in user)
 */
exports.getReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, sort, fields, keyword, ...filters } = req.query;

  // Build query string
  const queryStr = buildFilter(filters);

  // Pagination
  const skip = (page - 1) * limit;

  let mongooseQuery = Review.find(JSON.parse(queryStr) , req.filterObj)
    .skip(skip)
    .limit(limit)
    

  // Sorting
  mongooseQuery = mongooseQuery.sort(buildSort(sort));

  // Field limiting
  mongooseQuery = mongooseQuery.select(buildFields(fields));

  if (keyword) {
    mongooseQuery = mongooseQuery.find(buildKeywordSearch(keyword));
  }

  const reviews = await mongooseQuery;
  res.json({ results: reviews.length, page, data: reviews });
});

/**
 *  @desc    get one review
 *  @route   /api/reviews
 *  @method  GET
 *  @access  public (logged in user)
 */
exports.getReview = asyncHandler(async (req, res , next) => {
  const { id } = req.params;
  const review = await Review.findById(id).select("-__v");
  if (!review) {
    return next(new ApiError(`No Review for this id ${id}`, 404))
  }
  res.status(200).json({ data: review });
});

/**
 *  @desc    update review
 *  @route   /api/reviews
 *  @method  PUT
 *  @access  private (logged in user)
 */
exports.updateReview = asyncHandler(async (req, res , next) => {
  const { title , ratings } = req.body;
  const { id } = req.params;  
  const updateReview= await Review.findOneAndUpdate(
    {_id : id},
    {
      title,
      ratings
    },
    { new: true }
  );
  if (!updateReview) {
    return next(new ApiError(`No Review for this id`, 404))
  }
  res.json({ message: "Review updated successfully", data: updateReview });
});

/**
 *  @desc    delete review
 *  @route   /api/reviews
 *  @method  DELETE
 *  @access  private (user himself admin and manager )  
 */
exports.deleteReview= asyncHandler(async (req , res , next)=>{
  const {id} = req.params;
  const deleteReview = await Review.findByIdAndDelete(id);
  if (!deleteReview) {
    return next(new ApiError(`No Review for this id ${id}`, 404))
  }
  res.json({ message: "Review deleted successfully" });
})