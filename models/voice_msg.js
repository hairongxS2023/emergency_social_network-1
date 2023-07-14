import mongoose from "mongoose";
const Schema = mongoose.Schema;

const voice_msg = new Schema({
  sender: {
    type: String,
  },
  status: {
    type: String,
    default: "undefined",
  },
  voicedata: {
    type: Buffer,
    },
  timesent: {
    type: String,
    minlength: 1,
  },
  timestamp: { // Add this field
    type: Date,
    default: Date.now,
  },
});
const voice_msg_model = mongoose.model(
  "voice_msg",
  voice_msg
);
export default voice_msg_model;
