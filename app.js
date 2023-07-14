import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import MongooseClass from "./utils/database.js";
import http from "http";
import { Server } from "socket.io";
import { userRoute } from "./routes/userRoute.js";
import { messageRoute } from "./routes/messageRoute.js";
import Auth from "./middleware/auth.js";
import Test from "./middleware/test_mode.js";
import dotenv from "dotenv";
import cors from "cors";
import Messageprivate from "./controller/private_message_controller.js";
import { Result } from "express-validator";
import MessageDonation_controller from "./controller/resource_controller.js";
dotenv.config();

const router = express.Router();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

const io = new Server(server);
const LOCAL_URL = process.env.LOCAL_SERVER_URL;

//=========================================================
//=====================  ROUTES  ==========================
//=========================================================
//MongooseClass.initDB();

const userRoute_entity = new userRoute(io, router);
const messageRoute_entity = new messageRoute(io, router);

//index page
app.get("/", Test.checkTestMode, (req, res) => {
  // let active_status ='active';
  // if( req.body){
  //   active_status = req.body.active_status;
  // }
  res.render("./index.ejs");
});
//welcome page
app.get("/welcome",Test.checkTestMode, Auth.verifyToken, (req, res) => {
  res.render("welcome.ejs");
});
//ESN directory page
app.get("/ESN_directory_page", Test.checkTestMode,Auth.verifyToken, (req, res) => {
  const username_t = req.query.username;
  res.render("./ESNdirectoryPage.ejs", { username: username_t });
});
//information search page
app.get("/InformationSearchCitizenPage", Test.checkTestMode,Auth.verifyToken, (req, res) => {
  res.render("./InformationSearchCitizenPage.ejs");
});
//speed test page
app.get("/speed_test",Test.checkTestMode, Auth.verifyToken, (req, res) => {
  res.render("./speed_test.ejs");
});
//share status page
app.get("/share_status_page",Test.checkTestMode, Auth.verifyToken, (req, res) => {
  const username_t = req.query.username;
  res.render("./share_status_page.ejs", { username: username_t });
});
//notification status page
app.get("/notificationStatus", Auth.verifyToken, (req, res) => {
  Messageprivate.displayNotification(req, res);
});
//information search page
app.get("/InformationSearchPage", Auth.verifyToken, (req, res) => {
  res.render("./InformationSearchPage.ejs"); //Test.checkTestMode
});
//voice message page
app.get("/voice-message-page",Test.checkTestMode, Auth.verifyToken, (req, res) => {
  res.render("./voiceMessagePage.ejs");
});
//flood report page
app.get("/flood_report_page", Auth.verifyToken, (req, res) => {
  res.render("./flood_report.ejs", { username: req.username}); 
});
//new flood report page
app.get("/flood_report/new_report_page", Auth.verifyToken, (req, res) => {
  res.render("./new_report.ejs", { username: req.username}); 
});

app.get("/selfAssessment", Auth.verifyToken, (req, res) => {
  res.render("./selfAssessment.ejs"); //Test.checkTestMode
});

//information search page
app.get("/InformationSearchCitizenPage", Test.checkTestMode,Auth.verifyToken, (req, res) => {
  res.render("./InformationSearchCitizenPage.ejs");
});

//donation page
app.get("/donationPage", Test.checkTestMode,Auth.verifyToken, (req, res) => {
  MessageDonation_controller.readall(req, res, 'render_page');
});

//=========================================================
//=====================  SERVER  ==========================
//=========================================================
app.set("port", PORT);
app.set("view engine", "ejs");
mongoose.set("strictQuery", false);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://s23esnb3.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.json());
app.use(cors());
app.use( bodyParser.urlencoded({ extended: true, }) );
app.set("views", path.join(path.dirname(fileURLToPath(import.meta.url)), "views") );
app.use( express.static( path.join(path.dirname(fileURLToPath(import.meta.url)), "public") ));
app.use(router, (req, res, err) => {
  if (err) {
    console.log(err);
  }
});


//=========================================================
//==================  CONNECTE DB   =======================
//=========================================================
if (process.env.NODE_ENV !== "test") {//normal mode
  server.listen(PORT, () => {
  // MongooseClass.initDB();//connect to remote database
  MongooseClass.initDB();//connect to local database

    if (process.env.DYNO) {
      console.log('Server Running on Render');
    } else {
      console.log(`Server listening on ${LOCAL_URL}${PORT}`);
    }
  });
}
else {//test mode
  console.log("test mode");
  MongooseClass.connectLocalDB();//connect to local database
}
export default {app, server};
