import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notification = new Schema({
    username: {type:String, unique: true},
    sender_list: [{type:String, default: ""}], //list of sender
    show_notification: {type:Boolean, default: false},
});


const notification_model = mongoose.model("notification", notification);
export default notification_model;