import MongooseClass from "../utils/database.js";
import Register from "../controller/register_controller.js";
import Login from "../controller/login_controller.js";
import Logout from "../controller/logout_controller.js";
import User_Status from "../controller/status_controller.js";
import Speed_test from "../controller/speed_test_controller.js";
import Test from "../middleware/test_mode.js";
import ShareStatus_controller from "../controller/sharestatus_controller.js";
import Admin from "../controller/admin_controller.js";
import Auth from "../middleware/auth.js";
import Messageprivate from "../controller/private_message_controller.js";
import search_information_controller from "../controller/search_information_controller.js";
import volunteer_request_controller from "../controller/volunteer_controller.js";
import volunter_request_model from "../models/volunteer_request.js";
import volunteer_join_controller from "../controller/volunteer_join_controller.js";
import volunteer_join_request_model from "../models/volunteer_join_request.js";
import administrator_controller from "../controller/administrator_controller.js";
import MessageDonation_controller from "../controller/resource_controller.js";
import upload from "../middleware/multer.js";
import FloodReport from "../controller/flood_report_submission_controller.js";
import assessmentRecordController from "../controller/assessmentRecordController.js";
import assessmentController from "../controller/assessmentController.js";
import administratorController from "../controller/administrator_controller.js";

export class userRoute {
  io;
  router;
  constructor ( io, router )
  {
    this.router = router;
    this.io = io;
    this.runio();
    this.initRouter();
  }

  runio ()
  {
    this.io.on( "connection", ( socket ) =>
    {
      console.log( "socket: detect new connection" );
      this.io.emit( "new_online" );
      socket.on( "disconnect", () =>
      {
        console.log( "socket: user disconnected" );
      } );
    } );
  }
  usersRoute () {
    this.router.get('/users', Test.checkTestMode, Auth.verifyToken,async (req, res) => {
      await User_Status.get_all_status(req, res);
    });

    //Register New User
    this.router.post('/users', Test.checkTestMode, async (req, res) => {
      console.log("receive post request from registering button");
      //const New_User = new Register(req, res);
      await Register.register(req, res);
    });

    //login
    this.router.put("/users/:username/online", Test.checkTestMode, async (req, res) => {
      await Login.online(req, res);
    });

    //logout
    this.router
      .route( "/users/offline" )
      .put( async ( req, res ) =>
      {
        Logout.offline( req, res, this.io );
      } );

    //change to administrator
    this.router
      .route( "/users/:username/administrator" )
      .put( Test.checkTestMode, Auth.verifyToken, ( req, res ) =>
      {
        Admin.elect_to_admin( req, res )
      } )

    //************************************************************/
    //EmergencyLevels
    //Discription: 
    //Handles put request for setting emergency level for users.
    //Part of Shared Status Feature. Uses: dire_model def
    //Use Case: Share Status (2.2),ESN Dir,Chat user status.
    this.router
      .route( "/users/:username/EmergencyLevels" ).put( async ( req, res, status ) =>
      {
        console.log( "EmergencyLevels" );
        ShareStatus_controller.updateSharedStatus( req, res );
      } );
  }
  testRoute () {
    this.router.put( '/test-mode', ( req, res ) =>
    {
      req.app.set( 'isTestMode', true );
      Speed_test.init( req, res ).then( ( result ) =>
      {
        console.log( result );
        res.status( 200 ).json( { message: "Test mode enabled. Access denied to all routes." } );
      } );
    } );

    //stop test mode
    this.router.delete( '/test-mode', ( req, res ) =>
    {
      req.app.set( 'isTestMode', false );
      Speed_test.stop( req, res );
      res.status( 200 ).json( { message: "Test mode disabled. Access granted to all routes." } );
    } );
  }
  floodReportRoute(){
    this.router
    .route("/flood_reports")
    .post(Test.checkTestMode, upload.single("image"), async (req, res) => {
      FloodReport.submit_report(req, res,this.io);
    })
    .get(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      FloodReport.get_report_history(req, res);
    })
    .delete(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      FloodReport.delete_report(req, res);
    })
    .patch(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      FloodReport.update_vote(req, res);
    });
  }
  announcementRoute(){
    this.router
      .route( "/announcement_history" )
      .get( ( req, res ) =>
      {
        Announcement.loadAnnouncement( req, res );
      } )

    this.router
      .route( "/announcement" )
      .post( async ( req, res ) =>
      {
        await Announcement.postAnnouncement( req, res );
        this.io.emit( "new_announcement" );
      } )
  }
  notificationRoute(){
    this.router
      .route( "/receiver/notification" )
      .put( ( req, res ) =>
      {
        //console.log("receiver notification request, req.body = ", req.body);
        Messageprivate.pushNotification( req, res, this.io );
        //perform notification here,
        //idea: use io.emit to broadcast notification request
        //at page chatPublic and ESN directory, 
        //use socket.on{if req.body.receiver == username, then push notification}
        //here the page is on different user's perspective so username will be differernt
      } )
      .delete( Auth.verifyToken, ( req, res ) =>
      {
        Messageprivate.deleteNotification( req, res );
      } )
  }
  searchRoute(){
    this.router
    .route("/users/:search_value")
    .get(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      console.log("req query search", req.params.search_value);
      search_information_controller.search_user(req,res);
    })
  
  this.router
    .route("/users/statuses/:search_value")
    .get(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      search_information_controller.search_user_by_status(req,res);
    })

  this.router
    .route( "/announcement_search" )
    .post( Test.checkTestMode, Auth.verifyToken, async ( req, res ) =>
    {
      search_information_controller.search_announcement( req, res );
    } )
  }
  volunteerRoute(){
    this.router.route( "/volunteer-requests" )
    .get( Test.checkTestMode, Auth.verifyToken, async ( req, res ) => 
    {
      return volunteer_request_controller.searchVolunteerRequest( req, res );
    } );

  this.router.route( "/volunteer-request-posts" )
    .get( Test.checkTestMode, Auth.verifyToken, async ( req, res ) => 
    {
      res.render( "./makePost.ejs" );
    } );

    this.router
      .route("/donationPage")
      .get( Test.checkTestMode, Auth.verifyToken, async(req, res) => {
        MessageDonation_controller.load_all_donation_msg(req, res);
    })
    
  this.router.route( "/request-submissions" )
    .post( Test.checkTestMode, Auth.verifyToken, async ( req, res ) =>
    {
      return volunteer_request_controller.submitPost( req, res, this.io );
    } );
    this.router.route( "/volunteer-requests" )
    .get( Test.checkTestMode, Auth.verifyToken, async ( req, res ) => 
    {
      return volunteer_request_controller.searchVolunteerRequest( req, res );
    } );

  this.router.route( "/volunteer-request-posts" )
    .get( Test.checkTestMode, Auth.verifyToken, async ( req, res ) => 
    {
      res.render( "./makePost.ejs" );
    } );

  this.router.route( "/request-submissions" )
    .post( Test.checkTestMode, Auth.verifyToken, async ( req, res ) =>
    {
      return volunteer_request_controller.submitPost( req, res, this.io );
    } );

  // this.router.route( "/joinVolunteerRequest" )
  //   .get( Test.checkTestMode, Auth.verifyToken, async ( req, res ) => 
  //   {
  //     res.render( "./volunteer-join-requests.ejs" );
  //   } );
  //volunteer-join-requests

  this.router.route( "/volunteer-join-requests/:postID" )
    .get( Test.checkTestMode, Auth.verifyToken, async ( req, res ) => 
    {
      console.log( "req query postID", req.params.postID );
      return volunteer_join_controller.searchVolunteerRequest( req, res );
      //res.render( "./volunteer-join-requests.ejs" );
    } );

  this.router.route( "/volunteer-join-requests" )
    .post( Test.checkTestMode, Auth.verifyToken, async ( req, res ) => 
    {
      console.log( "req body username from join volunteer", req.body );
      return volunteer_join_controller.submitRequest( req, res );
      //res.render( "./volunteer-join-requests.ejs" );
    } );

  //volunteer-requests-management
  this.router.route( "/volunteer-requests-management/:username" )
    .get( Test.checkTestMode, Auth.verifyToken, async ( req, res ) => 
    {
      return volunteer_request_controller.manageVolunteerRequest( req, res );
    } );

  this.router.route( "/requests-fulfillment/:postID" )
    .put( Auth.verifyToken, async ( req, res ) => 
    {
      console.log( "req body username from fulfill in route:", req.url );
      return volunteer_request_controller.updateFulfilled( req, res );
    } );

  //volunteer-requests-update
  this.router.route( "/volunteer-requests-update" )
    .put( Test.checkTestMode, Auth.verifyToken, async ( req, res ) => 
    {
      console.log( "req body username from update volunteer", req.body );
      return volunteer_request_controller.addPersonToVolunteerRequest( req, res );
    } );
    //volunteer-requests-deletion
  this.router.route( "/volunteer-requests-deletion" )
    .put( Test.checkTestMode, Auth.verifyToken, async ( req, res ) => 
    {
      console.log( "req body username from delete join", req.body.volunteer );
      return volunteer_request_controller.deleteJoinRequest( req, res );
    } );
  }
  userProfilesRoute(){
    this.router
    .route("/user-authorities")
    .get(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      Admin.check_admin(req, res);
    });

    // administrator save username:
    // POST /api/administrator/user/username
    this.router
    .route("/user-profiles/usernames")
    .put(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      administratorController.saveUsername(this.io,req,res);
    });

    // administrator save password:
    // POST /api/administrator/user/password
    this.router
    .route("/user-profiles/passwords")
    .put(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      administratorController.savePassword(req,res);
    });

    this.router.route("/user-profiles")
    .get( Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      return administrator_controller.allUserProfiles(req, res);
    });

    this.router.route("/user-profiles/:username")
    .get( Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      return administrator_controller.searchUserProfile(req, res);
    });

    this.router.route("/user-profiles/account-statuses")
    .put( Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      return administrator_controller.updateAccountStatus(req, res,this.io);
    });

    this.router.route("/user-profiles/privilege-levels")
    .put( Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      return administrator_controller.updatePrivilegeLevel(req, res,this.io);

    });

    this.router
    .route("/user-profiles/passwords")
    .put(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
    
    });

    this.router
    .route("/user-profiles/:username")
    .get(Test.checkTestMode, Auth.verifyToken, async (req, res) => {
      //mock response, please change it when you implement the function
      res.status(200).json({authority: "administator"});
    });

  }
  
  assessmentRoute(){
    // Create a new assessment:
    // POST /api/assessments
    this.router
      .route('/api/assessments')
      .post(Test.checkTestMode,async (req, res) => {
        assessmentController.CreateAssessment(req,res);
      });

    // Retrieve all assessments:
    // GET /api/citizens/assessments
    this.router
    .route('/api/citizens/assessments')
    .get(Test.checkTestMode,async (req, res) => {
      assessmentController.GetAssessments(req,res);
    });

    // Retrieve a specific assessment:
    // GET /api/citizens/assessments
    this.router
      .route('/api/citizens/assessments/:id')
      .get(Test.checkTestMode,async (req, res) => {
        assessmentController.GetAssessments(req,res);
      });

    // Update a assessment:
    // PUT /api/citizens/assessments/:id
    this.router
      .route('/api/citizens/assessments/:id')
      .put(Test.checkTestMode, async (req, res) => {
        assessmentController.UpdateAssessmet(req,res);
      });
    // Delete a assessment:
    // DELETE /api/citizens/assessments/:id
    this.router
      .route('/api/citizens/assessments/:id')
      .delete(Test.checkTestMode,async (req, res) => {
        assessmentController.DeleteAssessmet(req,res);
      });

    // Create a new records:
    // POST /api/records
    this.router
      .route('/api/records')
      .post(Test.checkTestMode, async (req, res) => {
        assessmentRecordController.CreateAssessment(req,res);
      });

    // Retrieve all records:
    // GET /api/citizens/records
    this.router
    .route('/api/citizens/records')
    .get(Test.checkTestMode,async (req, res) => {
      assessmentRecordController.GetAssessments(req,res);
    });

    // Retrieve a specific records:
    // GET /api/citizens/records
    this.router
      .route('/api/citizens/records/:id')
      .get(Test.checkTestMode,async (req, res) => {
        assessmentRecordController.GetAssessments(req,res);
      });

    // Update a records:
    // PUT /api/citizens/records/:id
    this.router
      .route('/api/citizens/records/:id')
      .put(Test.checkTestMode, async (req, res) => {
        assessmentRecordController.UpdateAssessmet(req,res);
      });

    // Delete a records:
    // DELETE /api/citizens/records/:id
    this.router
      .route('/api/citizens/records/:id')
      .delete(Test.checkTestMode,async (req, res) => {
        assessmentRecordController.DeleteAssessment(req,res);
      });
  }
  initRouter () {
    this.usersRoute();
    this.testRoute();
    this.floodReportRoute();
    this.announcementRoute();
    this.notificationRoute();
    this.volunteerRoute();
    this.userProfilesRoute();
    this.searchRoute();
    this.assessmentRoute();
  }
}
