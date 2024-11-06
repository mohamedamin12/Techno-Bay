const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");

const {
  buildFilter,
  buildSort,
  buildFields,
  buildKeywordSearch,
} = require("../utils/apiFeatures");
const {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} = require("../utils/cloudinary");
const createToken = require("../utils/createToken");

/**
 * @desc    git all Users
 * @route   /api/auth/users
 * @method  GET
 * @access  private (only admin and manager)
 **/
exports.getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, sort, fields, keyword, ...filters } = req.query;

  // Build query string
  const queryStr = buildFilter(filters);

  // Pagination
  const skip = (page - 1) * limit;

  let mongooseQuery = User.find(JSON.parse(queryStr)).skip(skip).limit(limit);

  // Sorting
  mongooseQuery = mongooseQuery.sort(buildSort(sort));

  // Field limiting
  mongooseQuery = mongooseQuery.select(buildFields(fields));

  if (keyword) {
    mongooseQuery = mongooseQuery.find(buildKeywordSearch(keyword));
  }

  const users = await mongooseQuery;
  res.json({ results: users.length, page, data: users });
});

/**
 * @desc    git User
 * @route   /api/auth/users/:id
 * @method  GET
 * @access  public (only users authenticated)
 **/
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password -__v");
  if (!user) {
    return next(new ApiError(`user not found`, 404));
  }
  res.status(200).json({ user });
});

/**
 *  @desc    create a new user
 *  @route   /api/auth/users
 *  @method  POST
 *  @access  private (only admin and manager)
 **/
exports.createUser = asyncHandler(async (req, res) => {
  const { username, email, password , role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = await User.create({
    username,
    email,
    password: hashedPassword,
    role: role || "user",
  });
  res.status(201).json({ message: "User created successfully", data: users });
});

/**
 *  @desc    update user
 *  @route   /api/auth/users/:id
 *  @method  PUT
 *  @access private (only admin and manager)
 **/
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

/**
 *  @desc    change password
 *  @route   /api/auth/users/change-password
 *  @method  PUT
 * @access private (only admin and manager)
 **/
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

/**
 *  @desc    delete user
 *  @route   /api/auth/users/:id
 *  @method  DELETE
 *  @access private (only admin)
 **/
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new ApiError(`No delete for this id ${id}`, 404));
  }
  res.json({ message: "Delete deleted successfully" });
});

/**
 * @desc    Profile Photo Upload
 * @route   /api/users/profile-photo-upload
 * @method  POST
 * @access  protected (logged in user)
 */
exports.uploadProfilePhoto = asyncHandler(async (req, res, next) => {
  // 1. validate
  if (!req.file) {
    return next(new ApiError("no file provided", 400));
  }
  // 2. Get the path to the image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  // 3. Upload to cloudinary
  const upload = await cloudinaryUploadImage(imagePath);
  // 4. Get the user from DB
  const user = await User.findById(req.user.id);
  // 5. Delete the old profile photo if exist
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }
  // 6. Change the profilePhoto field in the DB
  user.profilePhoto = {
    url: upload.secure_url,
    publicId: upload.public_id,
  };
  await user.save();
  // 7. Send response to client
  res.status(200).json({
    message: "your profile photo uploaded successfully",
    profilePhoto: { url: upload.secure_url, publicId: upload.public_id },
  });
  // 8. Remove image from the server
  fs.unlinkSync(imagePath);
});

/**
 * @desc   Logged user data
 * @route   /api/users/getMe
 * @method  GET
 * @access  protected (logged in user)
 */
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

/**
 * @desc   Update logged user data (without password, role)
 * @route   /api/users/updateMe
 * @method  PUT
 * @access  protected (logged in user)
 */
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

/**
 * @desc   Update logged user password
 * @route   /api/users/change-my-password
 * @method  PUT
 * @access  protected (logged in user)
 */
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

/**
 * @desc   Deactivate logged user
 * @route   /api/users/deleteMe
 * @method  DELETE
 * @access  protected (logged in user)
 */
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});