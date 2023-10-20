const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const cloudinary = require("cloudinary");
const { 
  v4: uuidv4,
} = require('uuid');

const User = require('../db/models/userModel.js');

const errorHandler = require('../utils/errorHandler.js');
const asyncError = require('../middlewares/asyncErrors.js');
const sendToken = require('../utils/jwtToken.js');
const sendEmail = require("../utils/sendEmail");
const ApiFeatures = require("../utils/apiFeatures");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth.js");

String.prototype.shuffle = function () {
  var a = this.split(""), n = a.length;

  for(var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  
  return a.join("");
}

router.route('/signup').post(asyncError(async (req, res, next) => {
  if (req.body.seekingSkills.length < 3)
    return next(new errorHandler('Please Select Atleast 3 Seeking Skills', 400));
  else if (req.body.offeringSkills.length < 3)
    return next(new errorHandler('Please Select Atlest 3 Offering Skills', 400));

  const {
    username,
    email, 
    description,
    offeringSkills,
    seekingSkills,
    password 
  } = req.body;

  /*const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });*/

  const user = await User.create({
    username,
    email,
    description,
    password,
    avatar: {
      public_id: /*myCloud.public_id*/ "public id",
      url: /*myCloud.secure_url*/ "url",
    },
    offeringSkills,
    seekingSkills,
  });

  sendToken(user, 200, res);
}));

router.route('/login').post(asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new errorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new errorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
}));

router.route('/filters').get(asyncError(async (req, res) => {
  const resultPerPage = 12;
  const usersCount = await User.countDocuments();

  const apiFeature = new ApiFeatures(User.find(), req.query)
    .filter();

  let users = await apiFeature.query;

  let filteredUsersCount = users.length;

  apiFeature.pagination(resultPerPage);

  users = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    users,
    page: Number(req.query.page),
    usersCount,
    resultPerPage,
    filteredUsersCount,
  });
}));

router.route('/default').get(asyncError(async (req, res) => {
  const resultPerPage = 12;
  const usersCount = await User.countDocuments();
  
  const apiFeature = new ApiFeatures(User.find(), "")
    .pagination(resultPerPage);
  
  const users = await apiFeature.query;

  res.status(200).json({
    success: true,
    users,
    usersCount,
    page: Number(req.query.page),
    resultPerPage,
  });
}));

router.route('/algorithm').get(isAuthenticatedUser, asyncError(async (req, res) => {
  const resultPerPage = 12;
  const usersCount = await User.countDocuments();

  const apiFeature = new ApiFeatures(User.find(), req.query)
    .algorithm(req.user.seekingSkills);

  let users = await apiFeature.query;
  let AlgoUsersCount = users.length;
  apiFeature.pagination(resultPerPage);
  users = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    users,
    usersCount,
    page: Number(req.query.page),
    resultPerPage,
    AlgoUsersCount,
  });
}));

router.route('/logout').get(asyncError(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
}));

router.route('/password/forgot').post(asyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

  try {
    await sendEmail({
      template: "passwordRecover",
      email: user.email,
      subject: "Reset Your ModShare Password",
      name: user.username,
      link: resetPasswordUrl,
    });

    res.status(200).json({
      success: true,
      message: `Email was sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new errorHandler(error.message, 500));
  }
}));

router.route('/password/reset/:token').put(asyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new errorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new errorHandler("passwords does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
}));

router.route('/me').get(isAuthenticatedUser, asyncError(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
}));

router.route('/password/update').put(isAuthenticatedUser, asyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new errorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new errorHandler("passwords does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
}));

router.route('/profile/update').put(isAuthenticatedUser, asyncError(async (req, res, next) => {
  if (req.body.seekingSkills.length < 3)
    return next(new errorHandler("Please Select Atleast 3 Seeking Skills", 400));
  else if (req.body.offeringSkills.length < 3)
    return next(new errorHandler("Please Select Atleast 3 Offering Skills", 400));
  
  const newUserData = {
    username: req.body.name,
    email: req.body.email,
    description: req.body.description,
    offeringSkills: req.body.offeringSkills,
    seekingSkills: req.body.seekingSkills,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  sendToken(user, 200, res);
}));

router.route('/exchangeRequest/create').post(isAuthenticatedUser, asyncError(async (req, res, next) => {
  const { id } = req.query;
  const { title, description } = req.body;
  const identity = uuidv4();

  if (id == req.user._id) {
    return next(new errorHandler("You can't send Request to Yourself", 404));
  } else if (!title || !description) {
    return next(new errorHandler("Please fill all the fields", 400));
  }

  // User 1
  let request = {
    user: id,
    title,
    description,
    identity,
    status: "outgoing",
  };

  req.user.exchangeRequests.push(request);
  req.user.exchangeReqNum = req.user.exchangeRequests.length;

  await req.user.save({
    validateBeforeSave: false,
  });

  // User 2
  request = {
    user: req.user._id,
    title,
    description,
    identity,
    status: "incoming",
  };

  const user = await User.findById(id);
  user.exchangeRequests.push(request);
  user.exchangeReqNum = user.exchangeRequests.length;

  await user.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    exchangeRequest: request,
    success: true,
  });
}));

router.route('/exchangeRequest/cancel').post(isAuthenticatedUser, asyncError(async (req, res, next) => {
  const { identity } = req.query;
  const request = req.user.exchangeRequests.find(
    (r) => r.identity === identity
  );

  if (!request) {
    return next(new errorHandler("Exchange Request Not Found", 404));
  } else if (request.status !== 'outgoing') {
    return next(new errorHandler("You Can Only Cancel Outgoing Request", 400));
  }

  // User 1
  req.user.exchangeRequests = req.user.exchangeRequests.filter(
    (r) => r.identity !== identity
  );
  req.user.exchangeReqNum = req.user.exchangeRequests.length;

  await req.user.save({
    validateBeforeSave: false,
  });

  // User 2
  const user = await User.findById(request.user._id);

  user.exchangeRequests = user.exchangeRequests.filter(
    (r) => r.identity !== identity
  );
  user.exchangeReqNum = user.exchangeRequests.length;

  await user.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
  });
}));

router.route('/exchangeRequest/accept').post(isAuthenticatedUser, asyncError(async (req, res, next) => {
  const { identity } = req.query;
  const request = req.user.exchangeRequests.find(
    (r) => r.identity === identity
  );

  if (!request) {
    return next(new errorHandler("Exchange Request Not Found", 404));
  } else if (request.status !== 'incoming') {
    return next(new errorHandler("You Can Only Accept Incoming Request", 400));
  }

  // User 1 
  let exchangeSkill = {
    user: request.user._id,
    title: request.title,
    description: request.description,
    identity,
  };
  req.user.exchangeSkills.push(exchangeSkill);

  req.user.exchangeRequests = req.user.exchangeRequests.filter(
    (r) => r.identity !== identity
  );
  req.user.exchangeReqNum = req.user.exchangeRequests.length;

  await req.user.save({
    validateBeforeSave: false,
  });

  // User 2
  const user = await User.findById(request.user._id);

  exchangeSkill = {
    user: req.user._id,
    title: request.title,
    description: request.description,
    identity,
  };
  user.exchangeSkills.push(exchangeSkill);

  user.exchangeRequests = user.exchangeRequests.filter(
    (r) => r.identity !== identity
  );
  user.exchangeReqNum = user.exchangeRequests.length;

  await user.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
  });
}));

router.route('/exchangeRequest/reject').post(isAuthenticatedUser, asyncError(async (req, res, next) => {
  const { identity } = req.query;
  const request = req.user.exchangeRequests.find(
    (r) => r.identity === identity
  );

  if (!request) {
    return next(new errorHandler("Exchange Request Not Found", 404));
  } else if (request.status !== 'incoming') {
    return next(new errorHandler("You Can Only Reject Incoming Request", 400));
  }

  // User 1
  let exchangeNumPrev = req.user.exchangeRequests.length;
  
  req.user.exchangeRequests = req.user.exchangeRequests.filter(
    (r) => r.identity !== identity
  );
  
  req.user.exchangeReqNum = req.user.exchangeRequests.length;

  if (exchangeNumPrev === req.user.exchangeReqNum) {
    return next(new errorHandler("Exchange Request Not Found", 404));
  }

  await req.user.save({
    validateBeforeSave: false,
  });

  // User 2
  const user = await User.findById(request.user._id);

  user.exchangeRequests = user.exchangeRequests.filter(
    (r) => r.identity !== request.identity
  );

  user.exchangeReqNum = user.exchangeRequests.length;

  await user.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
  });
}));

router.route('/exchangeSkill/complete').post(isAuthenticatedUser, asyncError(async (req, res, next) => {
  const { identity } = req.query;
  const { rating, comment } = req.body;

  // User 1
  const request = req.user.exchangeSkills.find(
    (r) => r.identity === identity
  );

  if (!request) {
    return next(new errorHandler("Exchange Request Not Found", 404));
  }
  
  req.user.exchangeSkills = req.user.exchangeSkills.filter(
    (r) => r.identity !== identity
  );

  await req.user.save({
    validateBeforeSave: false,
  });

  // User 2
  const user = await User.findById(request.user._id);
  
  const review = {
    user: user._id,
    rating,
    comment,
  };

  user.reviews.push(review);
  user.numOfReviews = user.reviews.length;
  
  let ratings = 0, i = 0;

  user.reviews.forEach((rev) => {
    ratings += rev.rating;
    i++;
  });

  user.ratings = ratings / i;

  await user.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    review,
    success: true,
  });
}));

module.exports = router;