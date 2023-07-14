import mongoose from "mongoose";
import MongooseClass from "../utils/database.js"
import Time from "../utils/time.js"

const Schema = mongoose.Schema;

const citizens = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  status: {
    type: String,
    default: "offline", // the default status should be offline, if the user registers in, this attribute will be switched to online.
  },
  emergency_status:{
    type: String,
    default: "undefined",
  },
  emergency_status_time:{
    type: String,
    default: "undefined",
  },
  privilege:{
    type: String,
    default: "citizen",
  },
  account_status:{
    type: String,
    default: "active",
  },
});


//************************************************************/
//1.3. StoreStatus(timestamp,userStatus)
//Discription: Entity method StoreStatus updates the database.
citizens.statics.storeStatus = async function(req, res) 
{
  try 
  {
      const user=req.body.citizens;
      const  status=req.body.emergencyStatus;
      var timestamp=Time.get_time();

      //MongooseClass.initDB();
      //MongooseClass.switch_to_test_DB();

      //Find and update emergency status. 
      MongooseClass.findAndUpdate(citizen_model,
      { username: user },
      { emergency_status: status }
      ).then((result) =>{
        console.log(`User ${user} status has been updated time stamp:`,status);
      });
      //Find user and update emergency time. 
      MongooseClass.findAndUpdate(citizen_model,
        { username: user },
        { emergency_status_time: timestamp }
        ).then((result) =>{
          console.log(`User ${user} status has been updated time stamp:`,timestamp);
      });
  } 
  catch (error) {
    console.error(error);
    //throw new Error("Error updating user status");
  }
}

const citizen_model = mongoose.model("citizens", citizens);
export default citizen_model;

