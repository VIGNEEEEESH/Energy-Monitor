const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const currentControllers = require("../Controllers/Current-Controllers");

router.get("/get/datainminutes/:sensor",currentControllers.getDataInMinutes)
router.get("/get/datainminutesall/allsensors",currentControllers.getDataInMinutesAllSensors)

router.post(
  "/createcurrent/:sensor/:energy/:voltage",
  currentControllers.createCurrent
);
router.delete("/delete/:month", currentControllers.deleteCurrentByMonth);

module.exports = router;
