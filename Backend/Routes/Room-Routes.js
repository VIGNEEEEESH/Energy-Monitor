const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const roomControllers = require("../Controllers/Room-Controllers");
const imageUpload = require("../Middleware/image-upload");

router.get("/get/rooms/byuserid/:userId", roomControllers.getRoomsByUserId);
router.get("/get/room/byid/:id", roomControllers.getRoomById);
router.post(
  "/createroom/:userId",
  [
    check("room").notEmpty(),
    check("target").notEmpty(),
    check("sensor").notEmpty(),
  ],
  roomControllers.createRoom
);
router.patch(
  "/update/:id",
  [
    check("room").notEmpty(),
    check("target").notEmpty(),
    check("sensor").notEmpty(),
  ],
  roomControllers.updateRoomById
);
router.delete("/delete/:id", roomControllers.deleteRoomById);
module.exports = router;
