const Category = require("../models/categories.model");
const asyncHandler = require("express-async-handler");

/**
 *  @desc    create a new category
 *  @route   /api/categories
 *  @method  POST
 *  @access  private
 */
exports.createCategory = asyncHandler(async (req , res)=>{
  const {title} = req.body;
  const newCategory = new Category({title});
  await newCategory.save();
  res.status(201).json(newCategory);
});

/**
 *  @desc    get all categories
 *  @route   /api/categories
 *  @method  GET
 *  @access  public
 */
exports.getCategories = asyncHandler(async (req , res)=>{
  const categories = await Category.find({});
  res.json({ results: categories.length, data: categories });
});

/**
 *  @desc    get one category
 *  @route   /api/categories
 *  @method  GET
 *  @access  public
 */
exports.getCategoryById = asyncHandler(async (req , res)=>{
  const category = await Category.findById(req.params.id);
  if(!category) return res.status(404).json({message: 'Category not found'});
  res.json(category);
});

/**
 *  @desc    update category
 *  @route   /api/categories
 *  @method  PUT
 *  @access  private
 */
exports.updateCategory = asyncHandler(async (req , res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true});
  if(!category) return res.status(404).json({message: 'Category not found'});
  res.json(category);
});

/**
 *  @desc    delete category
 *  @route   /api/categories
 *  @method  DELETE
 *  @access  private
 */
exports.deleteCategory = asyncHandler(async (req , res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if(!category) return res.status(404).json({message: 'Category not found'});
  res.json({message: 'Category deleted'});
});