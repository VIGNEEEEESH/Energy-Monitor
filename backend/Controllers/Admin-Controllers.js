const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Admin = require("../Models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const { name, email, password, employeeId } = req.body;
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  if (existingAdmin) {
    const error = new HttpError("Email already exists, please try again", 500);
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not signup, please try again",
      500
    );
    return next(error);
  }
  const createdAdmin = new Admin({
    name,
    email,
    employeeId,
    password: hashedPassword,
    image: req.file.path,
  });
  try {
    await createdAdmin.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not create admin, please try again",
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdAdmin.id,
        email: createdAdmin.email,
        token: token,
        userRole: "admin",
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the admin, please try again",
      500
    );
    return next(error);
  }
  res
    .status(201)
    .json({ userId: createdAdmin.id, email: createdAdmin.email, token: token });
};
const getAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find admins, please try again",
      500
    );
    return next(error);
  }
  res.json({ admins: admins });
};
const getAdminById = async (req, res, next) => {
  let admin;
  try {
    admin = await Admin.findOne({}, { password: 0 });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find admin, please try again",
      500
    );
    return next(error);
  }
  res.json({ employee: admin });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  if (!existingAdmin) {
    const error = new HttpError("Invalid crudentials, please try again", 401);
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingAdmin.password);
  } catch (err) {
    const error = new HttpError("Could not log you in, please try again", 500);
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError("Invalid crudentials, please try again", 401);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingAdmin.id, email: existingAdmin.email },
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
  res.status(201).json({
    userId: existingAdmin.id,
    email: existingAdmin.email,
    token: token,
    userRole: "admin",
  });
};
const updateAdminById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again", 422));
  }
  const id = req.params.id;
  const { name, password, employeeId } = req.body;
  let admin;
  try {
    admin = await Admin.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  if (!admin) {
    const error = new HttpError(
      "Could not find the user with the id provided, please try again",
      500
    );
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    
    const error = new HttpError("Something went wrong, Please try again", 500);
    return next(error);
  }
  (admin.name = name),
    (admin.password = hashedPassword),
    (admin.employeeId = employeeId);
  admin.image = req.file.path;
  try {
    await admin.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  try {
    token = jwt.sign(
      { userId: admin.id, email: admin.email },
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
  res
    .status(201)
    .json({
      userId: admin.id,
      email: admin.email,
      token: token,
      userRole: "admin",
    });
};
const deleteAdminById = async (req, res, next) => {
  const id = req.params.id;
  let admin;
  try {
    admin = await Admin.findOne({ _id: id });
    if (!admin) {
      return next(
        new HttpError("Could not find the admin, please try again", 500)
      );
    }

    await admin.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the admin, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Admin successfully deleted" });
};
exports.createAdmin = createAdmin;
exports.getAdmins = getAdmins;
exports.getAdminById = getAdminById;
exports.login = login;
exports.updateAdminById = updateAdminById;
exports.deleteAdminById = deleteAdminById;
