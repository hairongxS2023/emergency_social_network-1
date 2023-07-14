import mongoose from "mongoose";
const Schema = mongoose.Schema;

const volunteer_request = new Schema( {
    user: { type: String },
    type:{type:String},
    details: { type: String }, //list of sender
    timesent: { type: String },
    volunteers_needed:{type:Number},
    volunteers_joined:{type:[String]},
    fulfilled:{type:Boolean},
    timestamp: { type: Date, default: Date.now }
} );


const volunteer_request_model = mongoose.model( "volunteer_request", volunteer_request );
export default volunteer_request_model;