import announcement_model from "../models/announcement.js";
import MongooseClass from "../utils/database.js";
import citizen_model from "../models/citizens.js";
import Time from "../utils/time.js";
const auth_list = ["coordinator", "administrator"];

class Announcement {
  static async loadAnnouncement(req, res) {
    try {
      let activeQuery = {sender_account_status: "active" };
      //console.log("At announcement_controller.js, get request of loading announcement");
      const result = await MongooseClass.findAllRecords(announcement_model,activeQuery);
      //console.log("At announcement_controller.js, get request of loading announcement "+result);
      return res.status(200).json({data : result});
    } catch (err) {
      return res.status(404).json({ message: "Not Found" });
    }
  }

  static async postAnnouncement(io, req, res) 
  {
    if(!req.body["username"] || !req.body["announcement_content"]){
      return res.status(400).json({ message: "Bad request for posting new announcement" });
    }
    const username = req.body["username"];
    try {
      const user = await MongooseClass.findAllRecords(citizen_model, {username: username});
      const privilege = user[0].privilege;
      console.log("user privilege: " + privilege+"user"+user);
      if(privilege == "citizen"){
        return res.status(403).json({ message: "You are not allowed to post new announcement" });
      }
      const new_announcement = new announcement_model({
        sender: req.body["username"],
        announcement_content: req.body["announcement_content"],
        timesent: Time.get_time(),
      });

      await new_announcement.save();
      console.log("At announcement_controller.js, post request of saving new announcement success");

      io.emit("new_announcement");
      res.status(201).json({ message: "New announcement posted" });  
    } catch (err) {
      res.status(500).json({ message: "Internal server error"});
    }
  }
}


export default Announcement;