import mongoose from "mongoose";
const Schema = mongoose.Schema;

const announcement = new Schema({
    sender: {type:String},
    announcement_content: {type:String}, //list of sender
    timesent:{type:String},
    sender_account_status:{
        type: String,
        default: "active",
      }
});


const announcement_model = mongoose.model("announcement", announcement);
export default announcement_model;