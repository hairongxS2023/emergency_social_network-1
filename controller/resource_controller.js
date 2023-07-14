import MongooseClass from "../utils/database.js";
import donation_msg_model from "../models/donation_resource_msg.js";
import Time from "../utils/time.js"
import citizen_model from "../models/citizens.js";

class MessageDonation_controller {

    static async broadcast(req, res, io) {
        const msg_body = req.body;
        const time_sent=Time.get_time();

        var emergency_status="Undefined";
        await MongooseClass.findAllRecords(citizen_model, 
          {username: msg_body.user})
        .then(async (result)=>{
          emergency_status = result[0]["emergency_status"];

          const dona_msg_model = new donation_msg_model({
            username: msg_body[ "user" ],
            resource: msg_body[ "resource" ],
            resource_quantity: msg_body[ "resource_quantity" ],
            timesent: time_sent,
            sender_emg_status: emergency_status,
            //sender_location: user_location,
            msg_status: msg_body["donation_status"],
            location_info: msg_body["location_info"],
          });
       
          await MongooseClass
          .insertRecord(dona_msg_model)
          .then((result) => {
            //MongooseClass.closeDB();
          //   console.log("At donation_msg_model.js, post request of saving msg_body success");
          })
          .catch((err) => {
            console.log("Inserting record into donation_msg_model failed, look up constraints in model");
            res.status(400).json({ message: "Invalid request: failed to insert record into donation_msg_model" });
          });

          io.emit("emit-donation-msg", msg_body, time_sent,emergency_status);
          res.status(200).json({ message: "Message Sent Successfully" });
        })
        .catch((err) => {
          console.log("Reading record failed, look up constraints in model");
          res.status(500).json({ message: "Error reading record from database" });
          //throw err;
        });
    }

    static async readall(req, res, type){
      donation_msg_model.aggregate([
        {
          $sort: { timesent: -1 }
        },
        // {
        //   $group: {
        //     _id: "$username",
        //     // donation_msg: { $first: "$$ROOT" }
        //   }
        // },
        // {
        //   $replaceRoot: { newRoot: "$donation_msg" }
        // },
        // {
        //   $sort: { timesent: -1 }
        // }
      ]).then((result) => {
        if (type === "render_page"){
          res.render("./donationPage.ejs", { msgs: result });
        }
        else{
          res.status(200).json({donations:result});
        }
      })
  }


    // static async readall(req, res, type){
    //   donation_msg_model.aggregate([
    //     {
    //       $sort: { timesent: -1 }
    //     },
    //     {
    //       $group: {
    //         _id: "$username",
    //         donation_msg: { $first: "$$ROOT" }
    //       }
    //     },
    //     {
    //       $replaceRoot: { newRoot: "$donation_msg" }
    //     },
    //     {
    //       $sort: { timesent: -1 }
    //     }
    //   ]).exec(function (err, result) {
    //       const data = {
    //         message: "search success",
    //         donation_msg_list: result
    //       };
    //       if (type === "render_page"){
    //         res.render("./donationPage.ejs", { msgs: result });
    //       }
    //       else{
    //         res.status(200).json({donations:result});
    //       }
    //   });
    // }
    


  static async deleteByUser(req, res) {
    try {
      const delete_choice = req.body.delete_msg;
      const username = req.body.user;
      if (delete_choice === 'yes') {
        await MongooseClass.deleteRecord(donation_msg_model, username, true);
        console.log("At donation_msg_model.js, put request of deleting msg_body success");
        res.status(200);
      } else {
        res.status(400);
      }
    } catch (err) {
      console.log("Deleting record into donation_msg_model failed, look up constraints in model");
      res.status(500);
    }
  }

  static async updateStatus(req, res) {
    try {
      const update_choice = req.body.donation_status;
      const username = req.body.user;
      //console.log("update_choice: " + update_choice);
      //console.log("username: " + username);
      await MongooseClass.findAndUpdate(donation_msg_model, {'username': username}, {'msg_status': update_choice});
      console.log("At donation_msg_model.js, put request of updating msg_body success");
      res.status(200);
    } catch (err) {
      console.log("Updating record into donation_msg_model failed, look up constraints in model");
      res.status(500);
    }
  }

}

export default MessageDonation_controller;