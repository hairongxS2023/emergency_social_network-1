//import registerManager from "../utils/register_helper.js";
import MongooseClass from "../utils/database.js";
import public_channel_msg_model from "../models/public_channel_msg.js";
import MessagePublic from "../controller/public_message_controller.js";
import EmergencyAnnouncement from "../controller/emergency_event_controller.js";
import private_channel_msg_model from "../models/private_channel_msg.js";
import InfoController from "../controller/search_information_controller.js";
import Messageprivate from "../controller/private_message_controller.js";
import Auth from "../middleware/auth.js";
import Test from "../middleware/test_mode.js";
import Voice from "../controller/voice_message_controller.js";
import MessageDonation_controller from "../controller/resource_controller.js";
import Announcement from "../controller/announcement_controller.js";
import donation_msg_model from "../models/donation_resource_msg.js";

export class messageRoute {
  io;
  router;
  constructor (io, router) {
    this.router = router;
    this.io = io;
    this.initRouter();
  }

  voiceRoute(){
    const upload = Voice.get_upload();
    this.router.route("/voice-messages")
    .post(Test.checkTestMode, Auth.verifyToken, upload.single("voice-message"),async (req, res) => {
      await Voice.broadcast_and_save_voice_message(this.io, req, res);
    })
    .get(Test.checkTestMode, Auth.verifyToken ,async (req, res) => {
      await Voice.get_all_voice_messages(req, res);
    })
    .delete(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      await Voice.delete_voice_message(this.io, req, res);
    });
  }
  emergencyEventRoute(){
    this.router.route("/emergency-events")
    .get(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      await EmergencyAnnouncement.get_all_announcements(req, res);
    })
    .post(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      await EmergencyAnnouncement.post_announcement(this.io, req, res);
    })
    .put(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      await EmergencyAnnouncement.modify_announcement(this.io, req, res);
    })
    .delete(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      await EmergencyAnnouncement.delete_announcement(this.io, req, res);
    });
  }
  chatRoute(){
    this.router.route("/publicChatPage")
    .get(Test.checkTestMode,Auth.verifyToken,async (req, res) => 
    {  
      return InfoController.PublicSearch(req,res);
    });


    this.router.route("/privateChatPage") 
      .put(Test.checkTestMode,Auth.verifyToken,async (req, res) =>
      {
        //console.log("this is put...");
         return InfoController.PrivateSearch(req,res);
      })
      .get(Test.checkTestMode, Auth.verifyToken,async (req, res)=>
      { //qqq
        return InfoController.PrivateSearchAdv(req,res);
      });

      this.router.route("/message/public")
      .post(Auth.verifyToken, async (req, res) => {
       MessagePublic.broadcast(req,res,this.io)
      })
      .get(Auth.verifyToken, async(req,res)=>{
        await MongooseClass.findAllRecords(public_channel_msg_model).then((result) => {
          res.status(200).json(result);
        });
      });

    this.router.route("/message/private")
      .post(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
        await Messageprivate.broadcast(req,res,this.io);
      })
  }
  announcementRoute(){
    this.router.route("/announcements")
    .get(Test.checkTestMode,Auth.verifyToken, async (req, res) => {
      await Announcement.loadAnnouncement(req, res);
    })
    .post(Test.checkTestMode,Auth.verifyToken, async (req, res) => {
      await Announcement.postAnnouncement(this.io, req, res);
    })
  }
  donationRoute(){
    this.router.route("/donations")
    .post(Auth.verifyToken, async (req, res) => {
      await MessageDonation_controller.broadcast(req,res,this.io)
    })
    .get(Auth.verifyToken, async (req, res) => {
      await MessageDonation_controller.readall(req,res)
    })
    .delete(Auth.verifyToken, async (req, res) => {
      await MessageDonation_controller.deleteByUser(req,res);
      this.io.emit('resource-delete');
    })

    this.router.route("/donation_statuses")
    .put(Auth.verifyToken, async (req, res) => {
      await MessageDonation_controller.updateStatus(req,res);
      this.io.emit('resource-update');
    })
  }
  initRouter() {
    this.voiceRoute();
    this.emergencyEventRoute();
    this.chatRoute();
    this.announcementRoute();
    this.donationRoute();
  }
}

// this.router.route("/message/private")
// .post(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
//   await Messageprivate.broadcast(req,res,this.io);
// })

// this.router.route("/donations")
// .post(Auth.verifyToken, async (req, res) => {
// await MessageDonation_controller.broadcast(req,res,this.io)
// })
// .get(Auth.verifyToken, async (req, res) => {
// await MessageDonation_controller.readall(req,res)
// })
// .delete(Auth.verifyToken, async (req, res) => {
// await MessageDonation_controller.deleteByUser(req,res);
// this.io.emit('resource-delete');
// })

// this.router.route("/donation_statuses")
// .put(Auth.verifyToken, async (req, res) => {
// await MessageDonation_controller.updateStatus(req,res);
// this.io.emit('resource-update');
// })

    
    // .get(Auth.verifyToken, async (req, res) => {
    //   await MessageDonation_controller.readall(req,res)
    // })

  //}
//}


    // this.router.route("/publicChatPage") // public Chat Page
    //   .get(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
    //     await MongooseClass.findAllRecords(public_channel_msg_model).then((result) => {
    //       //MongooseClass.closeDB();
    //       res.render("./publicChatPage.ejs", { msgs: result });
    //       // this.io.on("connection", (socket) => {
    //       //   //socket.emit("clear-old-msg"); //clear the appended msg everytime get a post request, then continue append latest db msgs.
    //       //   //soet.emit("exist-msg", result);
    //       //   //res.render( "./publicChatPage.ejs",{msgs:result} );
    //       // });
    //     });
    //   })
    
    
    // this.router.route("/privateChatPage") // public Chat Page
    //   .put(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
    //     console.log("get put request msg route")
    //     const user1 = req.body.user1;
    //     const user2=req.body.user2;
    //     //console.log( req.body.body.app )
    //     //console.log("req app:"+req.app);
    //     req.app.set("user1", user1);
    //     req.app.set("user2", user2);
    //     const roomID = Messageprivate.generateRoomID(req, res);
    //     req.app.set("roomID", roomID);
    //     res.status(204).json({Message:"generate RoomID success"});
    //   })
    //   .get(Test.checkTestMode, Auth.verifyToken, async (req, res)=>{
    //     const roomID = req.app.get("roomID");
    //     const user1 = req.app.get("user1");
    //     const user2 = req.app.get("user2");
    //     console.log("msg route: roomID: ", roomID);
    //     await MongooseClass.findAllRecords(private_channel_msg_model, {roomID:roomID}).then((result) => {
    //       //MongooseClass.closeDB();
    //       //console.log("rendering private chat room")
    //       res.render("./privateChatPage.ejs", { msgs: result, user1: user1, user2: user2, roomID:roomID});
    //     });
    //   });
