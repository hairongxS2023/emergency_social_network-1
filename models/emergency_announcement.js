import mongoose from "mongoose";
const Schema = mongoose.Schema;

const emergency_announcement = new Schema({
    sender: {type:String},
    status: {
        type:String,
        default: "undefined",
    },
    announcement_content: {type:String}, //list of sender
    timesent:{type:String},
    sender_account_status:{
        type: String,
        default: "active",
      }
});


const emergency_announcement_model = mongoose.model("emergency_announcement", emergency_announcement);
export default emergency_announcement_model;