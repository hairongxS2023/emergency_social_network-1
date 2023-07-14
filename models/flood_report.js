import mongoose from "mongoose";
const Schema = mongoose.Schema;

const flood_report = new Schema({
    poster:{
        type: String,
        require: true,
        minlength: 2,
    },
    image_source:{
        data: {
            type: Buffer,
            required: true,
        },
        contentType: String
    },
    location:{
        type: String,
        required: true,
        minlength: 1,
    },
    time:{
        type: String,
        required: true,
        minlength: 1,
    },
    upvote:{
        type: Number,
        default: 0,
    },
    downvote:{
        type: Number,
        default: 0,
    },
    voter_list: [{type:String, default: ""}],
});


const flood_report_model = mongoose.model("flood_report", flood_report);
export default flood_report_model;