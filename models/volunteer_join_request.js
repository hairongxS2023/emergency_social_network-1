import mongoose from "mongoose";
const Schema = mongoose.Schema;

const volunteer_join_request = new Schema( {
    postID: { type: String },
    requestor:{type: String},
    username: { type: String },
    reason: { type: String }, //list of sender
    timesent: { type: String },
    timestamp:{type: Date, default: Date.now}
} );

const volunteer_join_request_model = mongoose.model( "volunteer_join_request", volunteer_join_request );
export default volunteer_join_request_model;