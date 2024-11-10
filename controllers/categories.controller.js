const asyncHandler = require("express-async-handler");          
const Category = require("../models/categories.model");
const {
  buildFilter,
  buildSort,
  buildFields,
  buildKeywordSearch,
} = require("../utils/apiFeatures");

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
  const { page = 1, limit = 5, sort, fields, keyword, ...filters } = req.query;

  // Build query string
  const queryStr = buildFilter(filters);

  // Pagination
  const skip = (page - 1) * limit;

  let mongooseQuery = Category.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit);

  // Sorting
  mongooseQuery = mongooseQuery.sort(buildSort(sort));

  // Field limiting
  mongooseQuery = mongooseQuery.select(buildFields(fields));

  if (keyword) {
    mongooseQuery = mongooseQuery.find(buildKeywordSearch(keyword));
  }

  const category = await mongooseQuery;
  res.json({ results: category.length, page, data: category });
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