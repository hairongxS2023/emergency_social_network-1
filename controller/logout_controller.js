import MongooseClass from "../utils/database.js";
import citizen_model from "../models/citizens.js";

class Logout {
  static async offline(req, res, io) {
    const jsonString = Object.keys(req.body)[ 0 ];
    const jsonData = JSON.parse(jsonString);
    const username_here = jsonData.username;
    const req_query = { username: username_here };
    const up_query = { status: "offline" };
    console.log("this is jsondata"+jsonData.username);
    try {
      await MongooseClass.findAndUpdate(citizen_model, req_query, up_query);
      console.log("updated to offline.");
      io.emit("new_offline");
      return res.status(200).json({ message: "updated to offline" });
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({ message: "error updating to offline" });
    }
  }
}
export default Logout;
