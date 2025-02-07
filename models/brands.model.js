const mongoose = require('mongoose');

const brandsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true , "category title is required"],
    unique: [true, 'Category must be unique'],
    trim: true,
    minlength: [2, 'Too short category name'],
    maxlength: [32, 'Too long category name'],
  },
  // image: {
  //   type: Object,
  //   default: {
  //     url: { type: String, required: true },
  //     publicId: null,
  //   },
  // },
})

module.exports = mongoose.model('Brand', brandsSchema);