import MongooseClass from "../utils/database.js";
import citizen_model from "../models/citizens.js";

class User_Status {
    static async get_all_status(req, res) {
        let online_user;
        let offline_user;
        //MongooseClass.initDB();
        await MongooseClass.findAllRecords(citizen_model, { status: "online" })
          .then((result) => {
            //MongooseClass.closeDB();
            online_user = result;
            online_user.sort((a, b) => (a.username > b.username ? 1 : -1));
          })
        //MongooseClass.initDB();  
        await MongooseClass.findAllRecords(citizen_model, { status: "offline" })
          .then((result) => {
            //MongooseClass.closeDB();
            offline_user = result;
            offline_user.sort((a, b) => (a.username > b.username ? 1 : -1));
          });
        
        
        const mergedUsers = [...online_user, ...offline_user];


        res.status(200).json({ users: mergedUsers });
    }
}
export default User_Status;
  