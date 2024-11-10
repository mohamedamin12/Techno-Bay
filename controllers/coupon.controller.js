const asyncHandler = require("express-async-handler");
const Coupon = require("../models/coupon.model");
const ApiError = require("../utils/apiError");

const {
  buildFilter,
  buildSort,
  buildFields,
  buildKeywordSearch,
} = require("../utils/apiFeatures");


/**
 *  @desc    create a new coupon
 *  @route   /api/coupons
 *  @method  POST
 *  @access  private (only admin and manager)
 */
exports.createCoupon = asyncHandler(async (req, res) => {
  const { name, expire, discount } = req.body;
  const coupon = await Coupon.create({ name, expire, discount });
  res.status(201).json({ message: "coupon created successfully", data: coupon });
});


/**
 *  @desc    get all coupons
 *  @route   /api/coupons
 *  @method  GET
 *  @access  public private (only admin and manager)
 */
exports.getCoupons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, sort, fields, keyword, ...filters } = req.query;
  // Build query string
  const queryStr = buildFilter(filters);
  // Pagination
  const skip = (page - 1) * limit;
  let mongooseQuery = Coupon.find(JSON.parse(queryStr)).skip(skip).limit(limit);
  // Sorting
  mongooseQuery = mongooseQuery.sort(buildSort(sort));
  // Field limiting
  mongooseQuery = mongooseQuery.select(buildFields(fields));
  if (keyword) {
    mongooseQuery = mongooseQuery.find(buildKeywordSearch(keyword));
  }

  const coupons = await mongooseQuery;
  res.json({ results: coupons.length, page, data: coupons });
});

/**
 *  @desc    get one coupon
 *  @route   /api/coupons
 *  @method  GET
 *  @access  public private (only admin and manager)
 */
exports.getCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id).select("-__v");
  if (!coupon) {
    return next(new ApiError(`No Coupon for this id ${id}`, 404));
  }
  res.status(200).json({ data: coupon });
});

/**
 *  @desc    update Coupon
 *  @route   /api/Coupons
 *  @method  PUT
 *  @access  private private (only admin and manager)
 */
exports.updateCoupon= asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name , expire , discount } = req.body;
  const updateCoupon = await Coupon.findOneAndUpdate(
    { _id: id },
    {
      name,
      expire,
      discount
    },
    { new: true }
  );
  if (!updateCoupon) {
    return next(new ApiError(`No Coupon for this id ${id}`, 404));
  }
  res.json({ message: "Coupon updated successfully", data: updateCoupon });
});

/**
 *  @desc    delete coupon
 *  @route   /api/coupons
 *  @method  DELETE
 *  @access  private private (only admin and manager)
 */
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteCoupon = await Coupon.findByIdAndDelete(id);
  if (!deleteCoupon) {
    return next(new ApiError(`No coupon for this id ${id}`, 404));
  }
  res.json({ message: "coupon deleted successfully" });
});