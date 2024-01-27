const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/AppError');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const token = generateToken(newUser._id)
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
  const token = generateToken(user._id)
  res.status(201).json({
    status: 'success',
    token,
  });
});
