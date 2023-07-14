import MongooseClass from "../utils/database.js";
import private_channel_msg_model from "../models/private_channel_msg.js";
import citizen_model from "../models/citizens.js";
import notification_model from "../models/notification.js";
import Time from "../utils/time.js"

class Messageprivate
{
  static async broadcast ( req, res, io ){
    const msg_body = req.body;
    const timesent = Time.get_time();
    MongooseClass.findAllRecords( citizen_model, { username: msg_body[ "sender" ] ,account_status: "active"} ).then( async ( result ) =>
    {
      const emergency_status = result[ 0 ][ "emergency_status" ];
      const msg_model = new private_channel_msg_model( {
        sender: msg_body[ "sender" ],
        receiver: msg_body[ "receiver" ],
        msg: msg_body[ "msg" ],
        timesent: timesent,
        sender_emg_status: emergency_status,
        roomID: msg_body[ "roomID" ],
      } );
      
      await MongooseClass
        .insertRecord( msg_model )
        .then( ( result ) =>{
          console.log(
            "At private_message_controller.js, post request of saving msg_body success"
          );
        } )
        .catch( ( err ) =>{
          console.log(
            "Inserting record into private_msg_model failed, look up constraints in model"
          );
        } );
      io.emit( "emit-private-msg", msg_model );
      res.status( 200 ).json( { sender: msg_model.sender, receiver: msg_model.receiver } );
    } )
  }
  
  static generateRoomID ( req, res )
  {
    // console.log( req.body.body.app )
    let user1;
    let user2;
    // test if req.body is empty
    // if ( req.body )
    // {
    //   user1 = req.body.app[ 'user1' ];
    //   user2 = req.body.app[ 'user2' ];
    // } else
    // {
    user1 = String(req.app.get("user1")).trim();
    //user1 = req.app.get( "user1" ).trim();
    user2 = String(req.app.get("user2")).trim();
    //user2 = req.app.get( "user2" ).trim();
    //}
    const sortedUsers = [ user1, user2 ].sort(); // Sort the usernames alphabetically
    // username with lower alphabetical order comes first
    const roomID = sortedUsers.join( "" )
    //console.log(roomID);
    return roomID;
  }
    
    //two functions below may need to replace into notification controller
    static pushNotification(req, res, io){
      const update = {
        $addToSet: {sender_list: req.body.sender},
        $set: {show_notification: true},
      }
      MongooseClass.findAndUpdate(notification_model, {username: req.body.receiver}, update).then((err, writeResult)=>{
        io.emit("push-notification", req.body);
        res.status(203).json({message: "success update"})
      })
    }
    
    static displayNotification(req, res){
      const username = req.username;
      //console.log("username controller 63" + username);
      MongooseClass.findAllRecords(notification_model, {username: username}).then((result)=>{
        //console.log("result controller 66" + result)

        let displayStatus;
        if (result && result[0] && result[0]["show_notification"]) 
        {
  
           displayStatus = result[0]["show_notification"];
          let sender_list = result[0]["sender_list"];
          return res.status(200).json({ displayStatus: displayStatus, sender_list: sender_list });
        } else {
          return res.status(200).json({message: "no notifications to display for this user"});
        }

      }).catch
      ((err)=>{
        res.status(500).json({message: "error in finding notification"});
      });
     }

  static deleteNotification(req,res){
    const username = req.username;
    const update = {
      sender_list: [],
      show_notification: false,
    }
    MongooseClass.findAndUpdate(notification_model,{username:username},update)
    .then((result)=>{
      console.log("delete all sender in sender_list");
    })
    res.status(200).json({message: "delete successful"});
    }
}

export default Messageprivate;
