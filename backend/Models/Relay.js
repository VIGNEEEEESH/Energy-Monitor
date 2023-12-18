const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const relaySchema = new Schema({
  userId: { type: String, required: true },
  roomId: { type: String, required: true },
  sensorId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  enabled: { type: Boolean },
  In1Name: { type: String},
  In2Name: { type: String},
  In3Name: { type: String},
  In4Name: { type: String},

  in1: { type: String},
  in2: { type: String},
  in3: { type: String},
  in4: { type: String },
 
});
relaySchema.plugin(uniqueValidator);
module.exports = mongoose.model("Relay", relaySchema);
