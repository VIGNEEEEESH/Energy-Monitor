const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminControllers = require("../Controllers/Admin-Controllers");
const imageUpload = require("../Middleware/image-upload");

router.post(
  "/createAdmin",
  imageUpload.single("image"),
  [
    check("name").notEmpty(),
    check("email").isEmail().normalizeEmail(),
    check("password").notEmpty(),
  ],
  adminControllers.createAdmin
);
router.get("/get/admins", adminControllers.getAdmins);
router.get("/getadminbyid/:id", adminControllers.getAdminById);
router.post("/login", adminControllers.login);
router.patch(
  "/updateAdmin/:id",
  imageUpload.single("image"),
  [check("name").notEmpty(), check("password").notEmpty()],
  adminControllers.updateAdminById
);
router.delete("/delete/:id", adminControllers.deleteAdminById);
module.exports = router;
