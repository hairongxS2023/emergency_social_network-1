import mongoose from "mongoose";
const Schema = mongoose.Schema;

const public_channel_msg = new Schema({
  username: {
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
  sender_account_status:{
    type: String,
    default: "active",
  }
});
const public_channel_msg_model = mongoose.model(
  "public_channel_msg",
  public_channel_msg
);
 
// function public_channel_msg_model(connection) {
//   return connection.model("public_channel_msg", public_channel_msg);
// }

export default public_channel_msg_model;
