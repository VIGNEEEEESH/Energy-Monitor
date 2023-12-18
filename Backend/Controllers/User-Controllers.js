const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const {
    firstName,
    lastName,
    email,
    password,
    mobile,
    address,
    landmark,
    pincode,
    state,
    country,
  } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "Email already exists, please try again with other email",
      422
    );
    res.status(400).json({ error: "Email already exists, please try again" });

    return next(error);
    
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create the user, Please try again later",
      500
    );
    return next(error);
  }
  const createdUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    mobile,
    address,
    landmark,
    pincode,
    state,
    country,
    image: req.file.path,
  });
  try {
    await createdUser.save();
  } catch (err) {
    
    const error = new HttpError(
      "Something went wrong, Could not create the user please try again",
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Signing up failed, Please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({
    userId: createdUser.id,
    email: createdUser,
    token: token,

    userRole: "user",
  });
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    
    const error = new HttpError(
      "Something went wrong,Could not find users, Please try again",
      500
    );
    return next(error);
  }
  res.json({ users: users });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUsers;
  try {
    existingUsers = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, Please try again", 500);
    return next(error);
  }

  if (!existingUsers) {
    const error = new HttpError(
      "Invalid Crudentials, Email not found, Please try again",
      401
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUsers.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, Please check your crudentials and try again",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError("Invalid crudentials, Please try again", 401);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUsers.id,
        email: existingUsers.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, logging in failed, please try again",
      500
    );
    return next(error);
  }
  res.json({
    userId: existingUsers.id,
    email: existingUsers.email,
    token: token,

    userRole: "user",
  });
};
const getUsersById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not get the requested user, Please try again",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "Could not find the requested user, please check with the mail",
      500
    );
    return next(error);
  }
  res.json({ user: user });
};
const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs, please try again with valid crudentials",
        422
      )
    );
  }
  const id = req.params.id;

  const {
    firstName,
    lastName,
    password,
    mobile,
    address,
    landmark,
    pincode,
    state,
    country,
  } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not update the user, please try again",
      500
    );
    return error;
  }
  let user;
  try {
    user = await User.findOne({ _id: id });
    if (user) {
      (user.firstName = firstName),
        (user.lastName = lastName),
        (user.password = hashedPassword),
        (user.mobile = mobile),
        (user.address = address),
        (user.landmark = landmark),
        (user.pincode = pincode),
        (user.state = state),
        (user.country = country);
      user.image = req.file.path;
      await user.save();
    }
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    
    const error = new HttpError(
      "Something went wrong, updating failed, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({
    userId: user.id,
    email: user.email,
    token: token,
    userRole: "user",
  });
};
const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("User not found, please try again", 500);
  }
  const imagePath = user.image;
  try {
    await user.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Could not delete the user, please try again",
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "user successfully deleted" });
};
exports.createUser = createUser;
exports.login = login;
exports.getUsers = getUsers;
exports.getUsersById = getUsersById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
