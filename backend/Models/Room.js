const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  userId: { type: String, required: true },
  room: { type: String, required: true },
  target: { type: String, required: true },
  sensor: { type: String, required: true },
});
module.exports = mongoose.model("Room", roomSchema);
