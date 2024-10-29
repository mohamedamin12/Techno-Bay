const Category = require("../models/categries.model");
const asyncHandler = require("express-async-handler");

exports.createCategory = asyncHandler(async (req , res)=>{
  const {title} = req.body;
  const newCategory = new Category({title});
  await newCategory.save();
  res.status(201).json(newCategory);
});

exports.getCategories = asyncHandler(async (req , res)=>{
  const categories = await Category.find({});
  res.json({ results: categories.length, data: categories });
});

exports.getCategoryById = asyncHandler(async (req , res)=>{
  const category = await Category.findById(req.params.id);
  if(!category) return res.status(404).json({message: 'Category not found'});
  res.json(category);
});

exports.updateCategory = asyncHandler(async (req , res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true});
  if(!category) return res.status(404).json({message: 'Category not found'});
  res.json(category);
});

exports.deleteCategory = asyncHandler(async (req , res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if(!category) return res.status(404).json({message: 'Category not found'});
  res.json({message: 'Category deleted'});
});