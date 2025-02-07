const asyncHandler = require('express-async-handler');

const User = require('../models/user.model');

/**
 *  @desc    Add product to wishlist
 *  @route   /api/wishlist
 *  @method  POST
 *  @access  public (logged in user)
 */
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Product added successfully to your wishlist.',
    data: user.wishlist,
  });
});

/**
 *  @desc    Remove product from wishlist
 *  @route   /api/wishlist/:productId
 *  @method  DELETE 
 *  @access  public (logged in user)
 */
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Product removed successfully from your wishlist.',
    data: user.wishlist,
  });
});

/**
 *  @desc     Get logged user wishlist
 *  @route   /api/wishlist
 *  @method  GET  
 *  @access  public (logged in user)
 */
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    status: 'success',
    results: user.wishlist.length,
    data: user.wishlist,
  });
});