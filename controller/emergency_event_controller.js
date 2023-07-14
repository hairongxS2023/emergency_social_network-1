import emergency_announcement_model from "../models/emergency_announcement.js";
import MongooseClass from "../utils/database.js";
import Time from "../utils/time.js";

class EmergencyAnnouncement {
    static async get_all_announcements(req, res) {
        try {
            let activeQuery = { sender_account_status: "active" };
            await MongooseClass.findAllRecords(emergency_announcement_model,activeQuery).then((result) => {
                res.status(200).json({data:result});
            });
        } catch (err) {
            res.status(404).json({ message: "Not Found" });
        }
    }

    static async save_announcement(req, res) {
        if (!req.body.username || !req.body.announcement_content) {
          return res.status(400).json({ status: "Bad Request", message: "Missing required fields" });
        }
      
        const new_announcement = new emergency_announcement_model({
          sender: req.body.username,
          announcement_content: req.body.announcement_content,
          timesent: Time.get_time(),
        });
      
        try {
          const result = await MongooseClass.insertRecord(new_announcement);
          return res.status(200).json({ status: "OK" , id: result._id});
        //   return result._id;
        } catch (err) {
          console.log("Inserting record into voice_msg_model failed, look up constraints in model:", err);
          return res.status(500).json({ status: "Internal Server Error", message: "Error saving the announcement" });
        }
      }

    static async delete_announcement(io, req, res) {
        if (!req.body.id) {
          return res.status(400).json({ status: "Bad Request", message: "Missing required fields" });
        }
        const id = req.body.id;
        try {
            const result = await MongooseClass.deleteRecord(emergency_announcement_model, id, false, false, true);
            console.log(`Deleted announcement message with id ${id}`);
        } catch (err) {
            console.log(`In voice_msg_controller: Failed to delete announcement message with id ${id}`);
            return res.status(404).json({ status: "Not Found" });
        }
        io.emit("delete_emergency_announcement");
        return res.status(204).json({ status: "No Content" });
    }

    static async modify_announcement(io, req, res) {
        if (!req.body.id || !req.body.new_content) {
            return res.status(400).json({ status: "Bad Request", message: "Missing required fields" });
        }
        const id = req.body.id;
        const new_content = req.body.new_content;
        try {
            const result = await MongooseClass.findAndUpdate(emergency_announcement_model, {_id: id}, { announcement_content: new_content });
            console.log(`Modified announcement message with id ${id}`);
        } catch (err) {
            console.log(`In voice_msg_controller: Failed to modify announcement message with id ${id}`);
            return res.status(404).json({ status: "Not Found" });
        }
        io.emit("new_emergency_announcement");
        return res.status(200).json({ status: "OK" });
    }

    static async post_announcement(io, req, res) {
        await this.save_announcement(req, res);
        io.emit("new_emergency_announcement");
      }
}

export default EmergencyAnnouncement;