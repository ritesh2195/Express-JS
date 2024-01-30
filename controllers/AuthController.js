const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   confirmPassword: req.body.confirmPassword,
  //   passwordChangeAt: req.body.passwordChangeAt,
  // });
  const newUser = await User.create(req.body);
  const token = generateToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.validateUserPassword(password, user.password))) {
    return next(new AppError('wrong email or password', 401));
  }
  const token = generateToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not authorized to access this end point', 401),
    );
  }
  const decoder = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoder.id);
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token doesn't exist", 401),
    );
  }
  if (currentUser.changePasswordAfter(decoder.iat)) {
    return next(
      new AppError(
        'user recentaly change the password.please login with new password',
      ),
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(new AppError('there is no user found assosiated this email id', 404));
  }

  const resetToken = user.createResetPasswordToken();

  user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Change your password by clicking on this link ${resetURL}`;

  console.log(user.email)

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset password link',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'email is sent to change password',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was error on sending email.please try again', 500),
    );
  }
});

exports.resetPassword = (req, res, next) => {};
