const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const relayControllers = require("../Controllers/Relay-Controllers");

router.get("/get/switchdata/:sensorId", relayControllers.getRelayById);
router.get("/get/switchdata/byuser/:userId", relayControllers.getRelayByUser);
router.get("/get/switchdata/byroom/:roomId", relayControllers.getRelayByRoom);
router.post(
  "/createrelay",
  [
    check("userId").notEmpty(),
    check("roomId").notEmpty(),
    check("sensorId").notEmpty(),
    check("description").notEmpty(),
    check("location").notEmpty(),
    
    
  ],
  relayControllers.createRelay
);
router.patch(
  "/update/:sensorId",
  [
    check("description").notEmpty(),
    check("location").notEmpty(),
    check("enabled").notEmpty(),
   
  ],
  relayControllers.updateRelayById
);
router.put(
  "/update/switches/:sensorId",
  relayControllers.updateSwitchesById
);
router.put(
  "/update/switchboard/:sensorId",
  relayControllers.updateSwitchesBoardId
);
router.delete("/delete/:sensorId", relayControllers.deleteRelayById);
module.exports=router
