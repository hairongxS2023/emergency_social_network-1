import citizen_model from "../models/citizens.js";

class sharestatus_controller
{
    //1.2 UpdateSharedStatus()
    //Discription: 
    //Controller method updateSharedStatus 
    //updates and excutes the entity store function.
    static async updateSharedStatus(req, res) 
    {
      try 
      {   
          console.log("sharestatus_controller.updateSharedStatus(,)");
          await citizen_model.storeStatus(req,res);
          res.status(200).send("User status updated successfully");
      } 
      catch (error) 
      {
        console.error(error);
        res.status(400).send("Error updating user status");
      }
    }
    
}

export default sharestatus_controller;