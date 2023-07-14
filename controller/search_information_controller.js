
import MongooseClass from "../utils/database.js";
import public_channel_msg_model from "../models/public_channel_msg.js";
import Time from "../utils/time.js"
import citizen_model from "../models/citizens.js";
import Messageprivate from "../controller/private_message_controller.js";
import private_channel_msg_model from "../models/private_channel_msg.js";
import Stopwords_filter from "../utils/stopwords_filter.js";
import announcement_model from "../models/announcement.js";
import stop_words from "../utils/stopwords.js";



class search_information_controller {

    static async searchDataBase(req, res) 
    {
      try {

        let searchResults;
        searchResults = await public_channel_msg_model.search(req.query);
      
      } catch (error) {
        res.status(500).send({ message: 'Error searching database' });
      }
    }

    static async PrivateSearch(req,res)
    {
      console.log("get put request msg route")
      const user1 = req.body.user1;
      const user2 = req.body.user2;
      req.app.set("user1", user1);
      req.app.set("user2", user2);
      const roomID = Messageprivate.generateRoomID(req, res);
      req.app.set("roomID", roomID);
      return res.status(204).json({Message:"generate RoomID success"});
    }


    static async PrivateSearchAdv(req,res)
    {
      const roomID = req.app.get("roomID");
      const user1 = req.app.get("user1");
      const user2 = req.app.get("user2");
      console.log("msg route: roomID: ", roomID);

      let criteria = req.query.privateMessage;
      let msgcount = req.query.count; 
      if (criteria) 
      {
        const searchmsg =  Stopwords_filter.filterStopWords(criteria,true);
        if(typeof filtered != "string" && searchmsg===-1)
        {
          return res.status(404).json({  });
        }else 
        {
          if(searchmsg==="status")
          {
            //Note: If the search criteria is the word “status” (and nothing else)
            // the system displays the status histories of the other Citizen involved in the discussion 
            //(10 latest status changes in reverse chronological order).
            const query = { sender_emg_status: { $exists: true },sender_account_status: "active"};
            if(!msgcount)
            {
              msgcount =10;
            }
            await MongooseClass.findAllRecords(
              private_channel_msg_model,
               { roomID: roomID,
                 ...query },
                { createdAt: -1 }, 
                msgcount)
               .then((results) => {

                var  statusHistories = [];
                results.forEach((item) => {
                  const status = item.sender_emg_status;
                  const citizen = (item.sender === user1) ? user2 : user1;
                  const timesent = item.timesent;
                  statusHistories.push({ status:status,citizen: citizen ,timesent: timesent});
                });
              return res.status(200).json({ statusHistories });
            });

          }
          else
          {

            const query = { msg: searchmsg, sender_account_status: "active"};
            if(!msgcount)
            {
              msgcount =10;
            }
            await MongooseClass.findAllRecords(
              private_channel_msg_model,
               { roomID: roomID,
                 ...query },
                { createdAt: -1 }, 
                msgcount)
               .then((results) => {

              return res.status(200).json({ results });
            });
            
          }
      }
      } else 
      {
        try
         {
          await MongooseClass.findAllRecords(private_channel_msg_model, {roomID:roomID}).then((result) => {
          return res.render("./privateChatPage.ejs", { msgs: result, user1: user1, user2: user2, roomID:roomID});});

        } 
        catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error getting public messages' });
        }
      }
    }

    static async PublicSearch(req,res)
    {
      let criteria = req.query.publicMessage;
      let msgcount = req.query.count; 
      if (criteria) 
      {
        const searchmsg =  Stopwords_filter.filterStopWords(criteria,false);
        if(searchmsg===-1)
        {
         return res.status(404).json({  });
        }
  
        await MongooseClass.findAllRecords(public_channel_msg_model,{ msg: searchmsg }, { createdAt: -1 },msgcount)
        .then((results) => {
          console.log(results);
          return res.status(200).json({ results });
        })
        .catch((error) => {
          console.error(error);
          return res.status(404).send('search item not found ');
        });
      } 
      else {
        try {
          const result = await MongooseClass.findAllRecords(public_channel_msg_model);
          return res.render("./publicChatPage.ejs", { msgs: result });
        } catch (err) {
          console.error(err);
          return res.status(400).json({ error: 'error getting public messages' });
        }
      }
    }

    

    static async findInformation(req, res, io) {

        const msg_body = req.body;
        const time_sent=Time.get_time();
        var emergency_status="Undefined";

        await MongooseClass.findAllRecords(citizen_model,  {username: msg_body.user})
        .then(async (result)=>{ emergency_status = result[0]["emergency_status"];

          const msg_model = new public_channel_msg_model({
            username: msg_body[ "user" ],
            msg: msg_body[ "msg" ],
            timesent: time_sent,
            sender_emg_status: emergency_status
          });
        })
    }


    static async search_user(req,res){
      const search_info = req.params.search_value;
      //console.log(req.query);
      //console.log(req.body);
      console.log("search_info = ", search_info);
      await MongooseClass.findRespectiveRecords(citizen_model,'username',search_info)
      //await MongooseClass.findrespectiveRecords(citizen_model,search_info)          
      .then((result) => {
        //MongooseClass.findrespective();
        const target_user_list = result;
        const data = {
          message: "search success",
          userlist: target_user_list
        };
        res.status(200).json(data);
      })
    }

    static async search_user_by_status(req,res){
      //const search_info = req.body.data;
      const search_info = req.params.search_value;
      //const search_info = document.getElementById("searchInfo").value.toLowerCase();
      //console.log("search_info = ", search_info);
      await MongooseClass.findRespectiveRecords(citizen_model,'status',search_info)
      //await MongooseClass.findrespectiveByStatus(citizen_model,search_info)          
      .then((result) => {
        //MongooseClass.findrespective();
        const target_user_list = result;
        const data = {
          message: "search success",
          userlist: target_user_list
        };
        //console.log("target_user_list = ", target_user_list);
        res.status(200).json(data);
      })
    }
 

  static async search_announcement ( req, res )
  {
    let search_info = req.body.searchval;
    console.log("in serach annocunemnt");
    console.log(req.body);
    search_info = this.checkStopWords( search_info );

    if ( search_info === "" )
    {
      search_info = "!@#$%^&*()";
      //res.status(400).json({error:"search cannot be empty"});
    }
    //console.log(req);
    //console.log(req.body);
    let count = req.body.count;
    console.log( "info:" + search_info + 'and next' );
    await MongooseClass.findRespectiveRecords( announcement_model, 'announcement', search_info, count)
    //await MongooseClass.findAnnouncement( announcement_model, search_info, count )
      .then( ( result ) =>
      {
        //MongooseClass.findrespective();
        console.log( 'Here are results:' + result );
        //const announcements = result;
        const response = {
          message: "search success",
          announcements: result

        };
        res.status( 200 ).json( response );
      } )
  }

  static checkStopWords ( searchInfo )
  {
    const words = searchInfo.split( " " );
    let len = words.length;
    let validsearchInfo = "";
    for ( var i = 0; i < len; i++ )
    {
      if ( stop_words.includes( words[ i ] ) )
      {

      } else
      {
        validsearchInfo += words[ i ];
        validsearchInfo += ' ';
      }
    }
    if ( validsearchInfo != "" )
      validsearchInfo.slice( 0, -1 );
    while ( validsearchInfo.charAt( 0 ) === ' ' )
    {
      validsearchInfo = validsearchInfo.substring( 1 );
    }
    while ( validsearchInfo.charAt( validsearchInfo.length - 1 ) === ' ' )
    {
      validsearchInfo = validsearchInfo.substring( 0, validsearchInfo.length - 1 );


    }
    return validsearchInfo;
  }

 
}
export default search_information_controller;
  