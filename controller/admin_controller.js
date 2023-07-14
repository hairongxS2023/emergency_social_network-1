import MongooseClass from "../utils/database.js";
import citizen_model from "../models/citizens.js";

class Admin {
    static async administrator() {
        return new Promise((resolve, reject) => {
            MongooseClass.findAndUpdate(citizen_model, {username: username}, {privilege: "administrator"}).then((result) =>{
                console.log(`User ${username}  is the administrator right now.`);
                resolve({statusCode: 400, message: "Fail to change the authority role of user."});
            });
        });
    }
    
    static async elect_to_admin(req,res){
        const username_here = req.username;
        //console.log("in admin" + username_here)
        const req_query = { username: username_here };
        const up_query = { privilege: "administrator" };
        //MongooseClass.initDB();
        await MongooseClass
          .findAndUpdate(
            citizen_model, req_query, up_query
          )
          .then((result) => {
            //MongooseClass.closeDB();
            //console.log("addmin_controller.js, ", result)
            res.status(200).json({ message: "updated to administrator." });
            console.log("updated to administrator.");
          });

    }

    static async check_admin(req,res){
      const user_info = await MongooseClass.findAllRecords(citizen_model, {username: req.username});
      const privilege = user_info[0].privilege.toLowerCase();
      console.log(privilege);
      if (privilege != "administrator"){
        console.log("fail");
        res.status(401).json({message: "You are not authorized to perform this action"});
      }
      else{
        console.log("success");
        res.status(200).json({message: "You are authorized to perform this action"});
      }
    }
}


export default Admin;