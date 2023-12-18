const HttpError = require("../Middleware/http-error");
const Room = require("../Models/Room");
const { validationResult } = require("express-validator");

const createRoom = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const userId = req.params.userId;
  
  const { room, target, sensor } = req.body;
  let addedRoom = new Room({
    userId,
    room,
    target,
    sensor,
  });
  try {
    await addedRoom.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  res.status(201).json({ room: addedRoom });
};
const getRoomsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  
  let rooms;
  try {
    rooms = await Room.find({ userId: userId });
  } catch (err) {
    const error = HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  res.json({ rooms: rooms });
};
const getRoomById = async (req, res, next) => {
  const id = req.params.id;
  let room;
  try {
    room = await Room.findById(id);
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  res.json({ room: room });
};
const updateRoomById = async (req, res, next) => {
  const id = req.params.id;
  
  const { room, target, sensor } = req.body;
  
  let updatedRoom;
  try {
    updatedRoom = await Room.findById(id);
    if (updatedRoom) {
      (updatedRoom.room = room),
        (updatedRoom.target = target),
        (updatedRoom.sensor = sensor);
      await updatedRoom.save();
    } else {
      const error = new HttpError(
        "Could not find the room, please try again",
        500
      );
      return next(error);
    }
  } catch (err) {
    
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  res.json({ room: updatedRoom }).status(200);
};
const deleteRoomById = async (req, res, next) => {
  const id = req.params.id;
  let room;
  try {
    room = await Room.findById(id);
    if (room) {
      await room.deleteOne();
      res.json({ message: "Room deleted successfully" }).status(200);
    } else {
      const error = new HttpError(
        "Could not find the room, please try again",
        500
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the room, please try again",
      500
    );
    return next(error)
  }
};
exports.createRoom = createRoom;
exports.getRoomsByUserId = getRoomsByUserId;
exports.getRoomById = getRoomById;
exports.updateRoomById = updateRoomById;
exports.deleteRoomById = deleteRoomById;
