import citizen_model from "../models/citizens.js";
import Encryption from "../middleware/encrypt.js";
import reserve_words from "../utils/reserve_words.js";
import assessmentrecords_model from "../models/assessmentRecord.js";
import donation_resource_msg_model from "../models/donation_resource_msg.js"
import flood_report_model from "../models/flood_report.js";
import notification_model from "../models/notification.js"
import private_channel_msgs_model from "../models/private_channel_msg.js";
import public_channel_msgs_model from "../models/public_channel_msg.js";
import voice_msgs_model from "../models/voice_msg.js"
import volunteer_join_requests_model from "../models/donation_resource_msg.js"
import announcement_model from "../models/announcement.js"
import emergency_announcement_model from "../models/emergency_announcement.js"
import register_controller from "../controller/register_controller.js";

import Time from "../utils/time.js";
import MongooseClass from "../utils/database.js";

class Administrator_controller {
  
  static async updateDonationMsgss(username,newusername)
  {
      //Update donation_msgs data base
      let donation_msgs = await donation_resource_msg_model.updateMany({ username: username }, { username: newusername });
      if (!donation_msgs) {
        // thats ok. it mean user did not make any donation_msgs.
      }else{
        console.log("donation_msgs Matches:"+donation_msgs.matchedCount);
      }
        return donation_msgs;
  }

  static async updateAssessmentRecords(username,newusername)
  {
      //Update assessmentrecords data base
      let assessmentrecords = await assessmentrecords_model.updateMany({ username: username }, { username: newusername });
      if (!assessmentrecords) {
        // thats ok. it mean user did not make any assessmentrecords.
      }else{
        console.log("assessmentrecords Matches:"+assessmentrecords.matchedCount);
      }
        return assessmentrecords;
  }

 static async updateAnnouncements(username,newusername)
 {
       //Update announcements data base
       let announcements = await announcementModel.updateMany({ sender: username }, { sender: newusername });
       if (!announcements) {
        // thats ok. it mean user did not send any announcements.
       }else{
        console.log("announcements Matches:"+announcements.matchedCount);
       }
       return announcements;
 }

 static async updateEmergencyAnnouncements(username,newusername)
 {
    //Update emergency_announcementsModel data base
    let emergency_announcements = await emergency_announcementsModel.updateMany({ username: username }, { username: newusername });
    if (!emergency_announcements) {
      // thats ok. it mean user did not make any emergency_announcements.
    }else{
      console.log("emergency_announcementsModel Matches:"+emergency_announcements.matchedCount);
     }
    return emergency_announcements;
 }

 static async updateNotifications(username,newusername)
 {
    //  MongoServerError: E11000 duplicate key error collection: 63df08dab0dcf62a81a28de0_normal.notifications index: username_1 dup key: { username: "user05" }
    //Update notifications data base
    let notifications = await notification_model.updateMany({ username: username }, { username: newusername });
    if (!notifications) {
      // thats ok. it mean user did not make any notifications.
    }else{
      console.log("notifications Matches:"+notifications.matchedCount);
     }
    return notifications;
 }

 static async updatePublicChannelMsgs(username,newusername)
 {
    //Update flood_report_model data base
    let public_channel_msgs = await public_channel_msgsModel.updateMany({ username: username }, { username: newusername });
    if (!public_channel_msgs) {
      // thats ok. it mean user did not make any public_channel_msgs.
    }else{
      console.log("public_channel_msgs Matches:"+public_channel_msgs.matchedCount);
    }

    return public_channel_msgs;
 }

 static async updatePrivateRoomIDs(username,newusername)
 {
  // check new username with username rules; 
  const query = { sender: username};
  const messages = await private_channel_msgs_model.find(query);
    if(typeof messages  === "undefined") 
    {
      console.log("messages is undefined");
    } else {

    if(messages.length>0)
    {
      const roomId = messages[0].roomID;
      console.log(roomId);
      const updatedRoomId = roomId.replaceAll(username, newusername);
      console.log(updatedRoomId);
 
     let private_channel_msgs = await private_channel_msgs_model.updateMany(
       { roomID: { $regex: roomId } },
       { $set: { roomID: updatedRoomId } }
     );

    }else{
      console.log("this user did not have any privite message matches");
    }
   }
 }

 static async updateFloodReports(username,newusername)
 {
    //Update flood_report_model data base
    let flood_reports = await flood_report_model.updateMany({ username: username }, { username: newusername });
    if (!flood_reports) {
      // thats ok. it mean user did not make any flood_reports.
    }else{
      console.log("flood_reports Matches:"+flood_reports.matchedCount);
     }
    return flood_reports;
 }

 static async updatevoice_msgs(username,newusername)
 {
    //Update voice_msgsModel data base
    let voice_msgs = await voice_msgs_model.updateMany({ username: username }, { username: newusername });
    if (!voice_msgs) {
      // thats ok. it mean user did not make any public_channel_msgs.
    }else{
      console.log("voice_msgs Matches:"+voice_msgs.matchedCount);
    }
    return voice_msgs;
 }

 static async updateVolunteerJoinRequests(username,newusername)
 {
     //Update voice_msgsModel data base
     let volunteer_join_requests = await volunteer_join_requests_model.updateMany({ username: username }, { username: newusername });
     if (!volunteer_join_requests) {
       // thats ok. it mean user did not make any volunteer_join_requests.
     }else{
       console.log("volunteer_join_requests Matches:"+volunteer_join_requests.matchedCount);
      }
 
    return volunteer_join_requests;
 }

 static async updateUserNameWithRules(username, newusername) 
 {
  // check that the password is more than 3 chars
  if (newusername.length < 3) {
    return false;
  } else 
  {
    // should not contain any banned words.
    if (reserve_words.includes(username)) 
    {
      return false;
    } 
    else
    {
      let success = false;
      let citizen = await citizen_model.findOne({ username: username });
      if (!citizen) {
        success = false;
      } else {
        citizen.username = newusername;
        await citizen.save();
        console.log("citizen_model old:" + username + "," + newusername);
        success = true;
      }
      return success;
    }
  }
}

 static async updatePrivateChannelMessages(username,newusername)
 {
  //Update private_channel_msgs data base
   let private_channel_msgs = await private_channel_msgs_model.findOne({ sender: username });
    private_channel_msgs = await private_channel_msgs_model.updateMany({ sender: username }, { sender: newusername });
    if (!private_channel_msgs) {
      // thats ok. it mean user did not make any private_channel_msgs.
    }else
    {
      console.log("private_channel_msgs Matches sender :"+private_channel_msgs.matchedCount);
    }
    private_channel_msgs = await private_channel_msgs_model.updateMany({ receiver: username }, { receiver: newusername });
    if (!private_channel_msgs) {
      // thats ok. it mean user did not make any private_channel_msgs.
    }else{
      console.log("private_channel_msgs Matches receiver :"+private_channel_msgs.matchedCount);
    }
    
}

  // 4.3 save username (Eduardo Arreola)
  static async saveUsername(io,req, res) 
  {
    try {

      let { username, newusername } = req.body;

      // update username with rules
     await Administrator_controller.updateUserNameWithRules(username,newusername)

      //Update announcments
      await Administrator_controller.updateAnnouncements(username,newusername);

      //UpdateAssessmentRecords
      await Administrator_controller.updateAssessmentRecords(username,newusername);

      //UpdateDonationMsgss
      await Administrator_controller.updateDonationMsgss(username,newusername);

      //UpdateEmergencyAnnouncements
      await Administrator_controller.updateEmergencyAnnouncements(username,newusername);

      //UpdateNotifications
      await Administrator_controller.updateNotifications(username,newusername);
    
      //UpdateFloodReports
      await Administrator_controller.updateFloodReports(username,newusername);

      //UpdateVolunteerJoinRequests
      await Administrator_controller.updateVolunteerJoinRequests(username,newusername);

      //UpdatePublicChannelMsgs
      await Administrator_controller.updatePublicChannelMsgs(username,newusername);


     //UpdatePrivateRoomIDs
     await Administrator_controller.updatePrivateRoomIDs(username,newusername);

     //UpdatePrivateChannelMessages
     await Administrator_controller.updatePrivateChannelMessages(username,newusername);

     await Administrator_controller.updateFloodReports(username,newusername)

     await Administrator_controller.updatevoice_msgs();
     
    // let new_announcement = new announcement_model({
    //   sender: req.body["username"],
    //   announcement_content:'user '+username+'has updated their username to:'+newusername,
    //   timesent: Time.get_time(),
    // });
    // await new_announcement.save();
    // console.log("At announcement_controller.js, post request of saving new announcement success");
    // io.emit("new_announcement");
    //await Announcement.postAnnouncement(this.io, req, res);

      return res.status(200).json({ message: "Username updated" });
    } catch (error) 
    {
      console.error(error);
      return res.status(500).json({ message: "Error updating username" });
    }
  }

  // 5.3 save password (Eduardo Arreola)
  static async savePassword(req, res) {
    try {
      const { username, newpassword } = req.body;

      if (newpassword.length < 3) {
        return res.status(400).json({ message: ' users and should be at least 3 characters long' });
      } 
      const hashedPassword = await Encryption.encrypt(newpassword);
      const result = await citizen_model.updateOne({ username: username },  { password: hashedPassword });
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Citizen not found' });
      }else
      {
        return res.status(200).json({ message: 'Password updated successfully' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating password' });
    }
  }


    static async allUserProfiles ( req, res ) 
    {
        try
        {
            const result = await MongooseClass.findAllRecords( citizen_model );
            console.log( "here are results" + result[ 0 ] );
            return res.status(200).json(result);
        } catch ( err )
        {
            console.error( err );
            return res.status( 400 ).json( { error: 'bad request: error getting user profiles' } );
        }
    }

    static async searchUserProfile ( req, res ) 
    {
        
        try
        {
            let username = req.params.username;
            const current_user = await citizen_model.find( {
                username: username,
            } );
            console.log("current user in serach profile"+current_user);
            if( current_user.length < 1 ){
                return res.status( 404 ).json( { error: "User not found" } );
            }
            console.log(current_user);
            console.log( "here are results" + current_user );
            return res.status(200).json(current_user[0]);
        } catch ( err )
        {
            console.error( err );
            return res.status( 400 ).json( { error: 'error getting volunteer requests from volunteer controller' } );
        }
    }

    static async updateAccountStatus ( req, res, io )
    {
        let curr_user = req.body.username_t;
        const username = req.body.username;
        console.log("current username is: ", username);
        const user_res = await citizen_model.find( {
            username:username
        } );
        console.log("current user is: ", curr_user);

        // if(curr_user==username){
        //     return res.status( 401 ).json( { error: "You can not deactivate your own account" } );
        // }
        if( user_res.length < 1 ){
            return res.status( 404 ).json( { error: "User not found"+username } );
        }
        const is_admin = await citizen_model.find( {
            username: curr_user,
            privilege: 'administrator'
        } );

        if(is_admin.length < 1 ){
            return res.status( 401 ).json( { error: "Only administrator can perform this action" } );
        }

        const new_status = req.body.status;
        const req_query = { username:username};
        const update_query = { account_status: new_status };
        console.log("curr+user: ", curr_user, username);
        try{
            const result = await MongooseClass
            .findAndUpdate(
                citizen_model, req_query, update_query
            );
            if ( new_status == "inactive" ){
                await MongooseClass.findAndUpdate(citizen_model, req_query, {status: "offline"});
                io.emit("emit-set-inactive", {username: req.body.username});
            }else{
                await MongooseClass.findAndUpdate(citizen_model, req_query, {status: "online"});
            }
            await this.setAnnouncementStatus(username, new_status);
            console.log("success from setAnnouncementStatus");
            await this.setPrivateMessageStatus(username, new_status);
            console.log("success from setPrivateMessageStatus");
            await this.setPublicMessageStatus(username, new_status);  
            console.log("success from setPublicMessageStatus");
            res.status( 200 ).json( { message: `updated the account status of user ${username} to ${new_status} successfully .` } );
        }catch( err ){
            console.error("err in updateAccountStatus: ", err);
            res.status(500).json({message:"error updating account status"});
                //MongooseClass.closeDB();
                //console.log("addmin_controller.js, ", result)
                
        };

    }

    static async updatePrivilegeLevel ( req, res,io )
    {
        let curr_user = req.body.username_t;
        const username = req.body.username;
        const new_privilege = req.body.privilege;
        console.log("new privilege is: ", new_privilege,"for user: ", username);
        const user_res = await citizen_model.find( {
            username:username
        });
        let adminCount = await this.getAdminCount();
        if(adminCount==1 && user_res[0].privilege=='administrator' && user_res[0].username==username){
            return res.status( 403 ).json( { error: "There has to be at least one administrator" } );
        }
        console.log(user_res);
        if( user_res.length < 1 ){
            return res.status( 404 ).json( { error: "User not found" } );
        }
        console.log("current user is: ", curr_user);
        const is_admin = await citizen_model.find( {
            username: curr_user,
            privilege: 'administrator'
        });

        if(is_admin.length < 1 ){
            return res.status( 401 ).json( { error: "Only administrator can perform this action" } );
        }

        const req_query = { username:username};
        const update_query = { privilege: new_privilege };
        await MongooseClass
            .findAndUpdate(
                citizen_model, req_query, update_query
            )
            .then( ( result ) =>
            {
                //MongooseClass.closeDB();
                //console.log("addmin_controller.js, ", result)
                res.status( 200 ).json( { message: `updated the privilage  of user ${username} to ${new_privilege} successfully .` } );
            } );

    }

    static async setAnnouncementStatus(username,account_status){
        let nameQuery = {sender:username};
        let setStatusQuery = {sender_account_status:account_status};
        await announcement_model.updateMany(nameQuery,setStatusQuery);
    };

    static async setEmergencyAnnouncementStatus(username,account_status){
        let nameQuery = {sender:username};
        let setStatusQuery = {sender_account_status:account_status};
        await emergency_announcement_model.updateMany(nameQuery,setStatusQuery);
    };

    static async setPrivateMessageStatus(username,account_status){
        let nameQuery = {sender:username};
        let setStatusQuery = {sender_account_status:account_status};
        await private_channel_msgs_model.updateMany(nameQuery,setStatusQuery);
    };

    static async setPublicMessageStatus(username,account_status){
        let nameQuery = {sender:username};
        let setStatusQuery = {sender_account_status:account_status};
        await public_channel_msgs_model.updateMany(nameQuery,setStatusQuery);
    };

    static async getAdminCount(){
        try{
            let adminQuery = { privilege: 'administrator' };
            const admins = await MongooseClass.findAllRecords(citizen_model,adminQuery );
            let adminCount = admins.length;
            return adminCount;
        }catch(err){
            console.log(err);
        }
        return 0;
    }

  }
export default Administrator_controller;