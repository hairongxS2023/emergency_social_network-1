import MongooseClass from "../utils/database.js";
import public_channel_msg_model from "../models/public_channel_msg.js";
import Time from "../utils/time.js"
import citizen_model from "../models/citizens.js";

class MessagePublic {

    static async broadcast(req, res, io) {
        const msg_body = req.body;
        const time_sent=Time.get_time();
        var emergency_status="Undefined";
        await MongooseClass.findAllRecords(citizen_model, 
          {username: msg_body.user,account_status: "active"})
        .then(async (result)=>{
          if(result.length!=0){
           emergency_status = result[0]["emergency_status"];
          }
          const msg_model = new public_channel_msg_model({
            username: msg_body[ "user" ],
            msg: msg_body[ "msg" ],
            timesent: time_sent,
            sender_emg_status: emergency_status
          });
          await MongooseClass
          .insertRecord(msg_model)
          .then((result) => {
            console.log("At public_msg_model.js, post request of saving msg_body success");
          })
          .catch((err) => {
            console.log("Inserting record into public_msg_model failed, look up constraints in model");
          });
          io.emit("emit-public-msg", msg_body, time_sent,emergency_status);
          res.status(200).json({ message: "Message Sent Successfully" });
        })
    }
}
export default MessagePublic;
  