import mongoose from "mongoose";
const Schema = mongoose.Schema;

const donation_msg = new Schema({
  username: {
    type: String,
  },
  resource: {
    type: String,
  },
  resource_quantity: {
    type: String,
  },
  timesent: {
    type: String, // Change to Date format
    required: true, // Make it required
  },
  sender_emg_status:{
    type: String,
  },
  msg_status:{
    type:String,
    default: "available",
  },
  location_info:{
    type:String,
  },
});
const donation_msg_model = mongoose.model(
  "donation_msg",
  donation_msg
);
 
// function public_channel_msg_model(connection) {
//   return connection.model("public_channel_msg", public_channel_msg);
// }

export default donation_msg_model;
