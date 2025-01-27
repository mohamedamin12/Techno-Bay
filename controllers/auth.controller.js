const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/user.model");
const createToken = require("../utils/createToken");
const sendEmail = require("../utils/sendEmail");

//* Helper function to hash password
const hashPassword = async (password) => await bcrypt.hash(password, 10);


/**
 * @desc    signup New User
 * @route   /api/auth/signup
 * @method  POST
 * @access  public
 */
exports.signup = asyncHandler(async (req, res, next) => {
  const hashedPassword = await hashPassword(req.body.password);

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  // 2- Generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

/**
 * @desc    Login  User
 * @route   /api/auth/login
 * @method  POST
 * @access  public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const token = createToken(user._id);

  delete user._doc.password;
  res.status(200).json({ data: user, token });
});


  /**
 * @desc    Forgot password
 * @route   /api/auth/forgotPassword
 * @method  POST
 * @access  public
 */
  exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError(`There is no user with that email ${req.body.email}`, 404)
      );
    }
  
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
  
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10m
    user.passwordResetVerified = false;
  
    await user.save();
  
    const message = `Hi ${user.username},\n We received a request to reset the password on your TechnoBay Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Vortex Team`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset code (valid for 10 min)",
        message,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;
  
      await user.save();

      return next(new ApiError("There is an error in sending email", 500));
    }
  
    res
      .status(200)
      .json({ status: "Success", message: "Reset code sent to email" });
  });
  
  /**
 * @desc    Verify password reset code
 * @route   /api/auth/verifyResetCode
 * @method  POST
 * @access  public
 */
  exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");
  
    const user = await User.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() }, 
    });
    if (!user) {
      return next(new ApiError("Reset code invalid or expired"));
    }
  
    user.passwordResetVerified = true;
    await user.save();
  
    res.status(200).json({
      status: "Success",
    });
  });
  
  /**
 * @desc    Reset password
 * @route   /api/auth/resetPassword
 * @method  PUT
 * @access  public
 */
  exports.resetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError(`There is no user with email ${req.body.email}`, 404)
      );
    }
  
    if (!user.passwordResetVerified) {
      return next(new ApiError("Reset code not verified", 400));
    }
  
    // Encrypt the new password
    user.password = await bcrypt.hash(req.body.newPassword, 10);
  
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
  
    await user.save();
  
    const token = createToken(user._id);
    res.status(200).json({ token });
  });
