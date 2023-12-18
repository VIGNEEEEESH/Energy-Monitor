const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const userControllers = require("../Controllers/User-Controllers");
const imageUpload = require("../Middleware/image-upload");

router.get("/get/users", userControllers.getUsers);
router.get("/get/user/byid/:id", userControllers.getUsersById);
router.post("/createuser", imageUpload.single("image"), [
  check("firstName").notEmpty(),
  check("lastName").notEmpty(),
  check("email").isEmail().normalizeEmail(),
  check("password").notEmpty(),
  check("address").notEmpty(),
  check("landmark").notEmpty(),
  check("pincode").notEmpty(),
  check("state").notEmpty(),
  check("country").notEmpty(),
],userControllers.createUser);
router.post("/login",userControllers.login)
router.patch("/update/:id",imageUpload.single("image"),[
    check("firstName").notEmpty(),
  check("lastName").notEmpty(),
  check("password").notEmpty(),
  check("address").notEmpty(),
  check("landmark").notEmpty(),
  check("pincode").notEmpty(),
  check("state").notEmpty(),
  check("country").notEmpty(),
],userControllers.updateUser)
router.delete("/delete/:id",userControllers.deleteUser)
module.exports=router