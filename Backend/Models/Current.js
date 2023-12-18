const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const currentSchema = new Schema({
  sensor: { type: String, required: true },
  dateandtime: { type: String, required: true },
  energy: { type: String, required: true },
  voltage: { type: String, required: true },
});
module.exports = mongoose.model("Current", currentSchema);
