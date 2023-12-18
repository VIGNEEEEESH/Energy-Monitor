const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Relay = require("../Models/Relay");

const createRelay = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }

  const {
    userId,
    roomId,
    sensorId,
    description,
    location,
    In1Name,
    In2Name,
    In3Name,
    In4Name,
  } = req.body;

  // Set in1 to HIGH if in1Name is provided
  const in1Value = In1Name ? "HIGH" : "LOW";
  const in2Value = In2Name ? "HIGH" : "LOW";
  const in3Value = In3Name ? "HIGH" : "LOW";
  const in4Value = In4Name ? "HIGH" : "LOW";

  enabled = true;

  let addedRelay = new Relay({
    userId,
    roomId,
    sensorId,
    description,
    location,
    enabled,
    In1Name,
    In2Name,
    In3Name,
    In4Name,

    in1: in1Value,
    in2: in2Value,
    in3: in3Value,
    in4: in4Value,
  });

  try {
    await addedRelay.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }

  res.status(201).json({ relay: addedRelay });
};

const getRelayById = async (req, res, next) => {
  const sensorId = req.params.sensorId;

  let relay;
  try {
    relay = await Relay.find(
      { sensorId: sensorId },
      // Exclude the specified fields from the retrieved relay
      { userId: 0, roomId: 0, In1Name: 0, In2Name: 0, In3Name: 0, In4Name: 0 }
    );
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }

  res.json({ relay });
};

const getRelayByUser = async (req, res, next) => {
  const userId = req.params.userId;
  let relays;
  try {
    relays = await Relay.find({ userId: userId });
  } catch (err) {
    const error = HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  res.json({ relays: relays });
};
const getRelayByRoom = async (req, res, next) => {
  const roomId = req.params.roomId;
  let relays;
  try {
    relays = await Relay.find({ roomId: roomId });
  } catch (err) {
    const error = HttpError("Something went wrong, please try again", 500);
    return next(error);
  }

  res.json({ relays });
};
const updateRelayById = async (req, res, next) => {
  const sensorId = req.params.sensorId;
  const { description, location, enabled, In1Name, In2Name, In3Name, In4Name } =
    req.body;
  let updatedRelay;
  try {
    updatedRelay = await Relay.findOne({ sensorId: sensorId });
    if (updatedRelay) {
      updatedRelay.description = description;
      updatedRelay.location = location;
      updatedRelay.enabled = enabled;
      updatedRelay.In1Name = In1Name;
      updatedRelay.In2Name = In2Name;
      updatedRelay.In3Name = In3Name;
      updatedRelay.In4Name = In4Name;

      await updatedRelay.save();
    } else {
      const error = new HttpError(
        "Could not find the relay, please try again",
        500
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  res.json({ relay: updatedRoom }).status(200);
};

const updateSwitchesById = async (req, res, next) => {
  const sensorId = req.params.sensorId;
  const { in1, in2, in3, in4 } = req.body;
  
  try {
    let updatedSwitches = await Relay.findOneAndUpdate(
      { sensorId: sensorId },
      {
        in1: in1 || "HIGH",
        in2: in2 || "HIGH",
        in3: in3 || "HIGH",
        in4: in4 || "HIGH",
      },
      { new: true }
    );

    if (!updatedSwitches) {
      const error = new HttpError(
        "Could not find the Relay, please try again",
        500
      );
      return next(error);
    }

    res.json({ relay: updatedSwitches });
  } catch (err) {
    
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
};
const updateSwitcheBoardById = async (req, res, next) => {
  const sensorId = req.params.sensorId;
  const { enabled } = req.body;
    console.log(enabled)
  try {
    let updatedSwitches = await Relay.findOneAndUpdate(
      { sensorId: sensorId },
      {
        enabled,
      },
      { new: true }
    );

    if (!updatedSwitches) {
      const error = new HttpError(
        "Could not find the Relay, please try again",
        500
      );
      return next(error);
    }

    res.json({ relay: updatedSwitches });
  } catch (err) {
    
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
};

const deleteRelayById = async (req, res, next) => {
  const sensorId = req.params.sensorId;
  let relay;
  try {
    relay = await Relay.findOne({ sensorId: sensorId });
    if (relay) {
      await relay.deleteOne();
      res.json({ message: "Relay deleted Successfully" }).status(200);
    } else {
      const error = new HttpError(
        "Could not find the relay, please try again",
        500
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the relay, please try again",
      500
    );
    return next(error);
  }
};
exports.createRelay = createRelay;
exports.getRelayById = getRelayById;
exports.getRelayByUser = getRelayByUser;
exports.getRelayByRoom = getRelayByRoom;
exports.updateRelayById = updateRelayById;
exports.updateSwitchesById = updateSwitchesById;
exports.updateSwitchesBoardId = updateSwitcheBoardById;
exports.deleteRelayById = deleteRelayById;
