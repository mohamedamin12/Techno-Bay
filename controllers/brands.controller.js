const Brands = require("../models/brands.model");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

/**
 *  @desc    create a new brand
 *  @route   /api/brands
 *  @method  POST
 *  @access  private
 */
exports.createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const newBrand = new Brands({ title });
  await newBrand.save();
  res.status(201).json(newBrand);
});

/**
 *  @desc    get all brands
 *  @route   /api/brands
 *  @method  GET
 *  @access  public
 */
exports.getAllBrands = asyncHandler(async (req , res)=>{
  const brands = await Brands.find({});
  res.json({ results: brands.length, data: brands });
});

/**
 *  @desc    get one brand
 *  @route   /api/brand
 *  @method  GET
 *  @access  public
 */
exports.getBrand = asyncHandler(async (req, res , next) => {
  const brand = await Brands.findById(req.params.id);
  if (!brand) {
    return next(new ApiError(`No Brand for this id ${id}`, 404))
  }
  res.json(brand);
});

/**
 *  @desc    update brand
 *  @route   /api/brand
 *  @method  PUT
 *  @access  private
 */
exports.updateBrand = asyncHandler(async (req, res , next) => {
  const brand = await Brands.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404))
  }
  res.json(brand);
});

/**
 *  @desc    delete brand
 *  @route   /api/brand
 *  @method  DELETE
 *  @access  private
 */
exports.deleteBrand = asyncHandler(async (req, res , next) => {
  const brand = await Brands.findByIdAndDelete(req.params.id);
  if (!brand) {
    return next(new ApiError(`No Brand for this id ${id}`, 404))
  }
  res.status(204).send();
});