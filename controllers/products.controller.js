const asyncHandler = require("express-async-handler");
const Product = require("../models/products.model");
const ApiError = require("../utils/apiError");

/**
 *  @desc    create a new product
 *  @route   /api/product
 *  @method  POST
 *  @access  private
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json(newProduct);
});

/**
 *  @desc    get all products
 *  @route   /api/products
 *  @method  POST
 *  @access  public 
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json({ results: products.length, data: products });
})

/**
 *  @desc    get one product
 *  @route   /api/products/:id
 *  @method  GET
 *  @access  public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  const product = await Product.findById(id)

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

/**
 *  @desc    update product
 *  @route   /api/categories
 *  @method  PUT
 *  @access  private (only admin and manager)
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!updateProduct) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.json({ message: "Product updated successfully", data: updateProduct });
});

/**
 *  @desc    delete Product
 *  @route   /api/products
 *  @method  DELETE
 *  @access  private (only admin)
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(id);
  if (!deleteProduct) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.json({ message: "Product deleted successfully" });
});