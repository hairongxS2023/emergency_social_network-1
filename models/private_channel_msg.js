import mongoose from "mongoose";
const Schema = mongoose.Schema;

const private_channel_msg = new Schema({
  sender: {
    type: String,
  },
  receiver:{
    type: String,
  },
  msg: {
    type: String,
    minlength: 1,
    maxlength: 200,
  },
  timesent: {
    type: String,
    minlength: 1,
  },
  sender_emg_status:{
    type: String,
  },
  roomID:{
    type: String,
  },
  sender_account_status:{
    type: String,
    default: "active",
  }
});
const private_channel_msg_model = mongoose.model(
  "private_channel_msg",
  private_channel_msg
);
export default private_channel_msg_model;
