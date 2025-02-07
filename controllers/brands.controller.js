/* eslint-disable no-undef */
const asyncHandler = require("express-async-handler");
const Brands = require("../models/brands.model");
const ApiError = require("../utils/apiFeatures");

const {
  buildFilter,
  buildSort,
  buildFields,
  buildKeywordSearch,
} = require("../utils/apiFeatures");

/**
 *  @desc    create a new brand
 *  @route   /api/brands
 *  @method  POST
 *  @access  private
 */
exports.createBrand = asyncHandler(async (req, res, next) => {
  const { title } = req.body;

  const newBrand = new Brands({
    title,
  });

  await newBrand.save();

  res.status(201).json({
    message: "Brand created successfully",
    data: newBrand,
  });
});

/**
 *  @desc    get all brands
 *  @route   /api/brands
 *  @method  GET
 *  @access  public
 */
exports.getAllBrands = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, sort, fields, keyword, ...filters } = req.query;

  // Build query string
  const queryStr = buildFilter(filters);

  // Pagination
  const skip = (page - 1) * limit;

  let mongooseQuery = Brands.find(JSON.parse(queryStr)).skip(skip).limit(limit);

  // Sorting
  mongooseQuery = mongooseQuery.sort(buildSort(sort));

  // Field limiting
  mongooseQuery = mongooseQuery.select(buildFields(fields));

  if (keyword) {
    mongooseQuery = mongooseQuery.find(buildKeywordSearch(keyword));
  }

  const brands = await mongooseQuery;
  res.json({ results: brands.length, page, data: brands });
});

/**
 *  @desc    get one brand
 *  @route   /api/brand
 *  @method  GET
 *  @access  public
 */
exports.getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brands.findById(req.params.id);
  if (!brand) {
    return next(new ApiError(`No Brand for this id ${id}`, 404));
  }
  res.json(brand);
});

/**
 *  @desc    update brand
 *  @route   /api/brand
 *  @method  PUT
 *  @access  private
 */
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brands.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.json(brand);
});

/**
 *  @desc    delete brand
 *  @route   /api/brand
 *  @method  DELETE
 *  @access  private
 */
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brands.findByIdAndDelete(req.params.id);
  if (!brand) {
    return next(new ApiError(`No Brand for this id ${id}`, 404));
  }
  res.status(204).send();
});
