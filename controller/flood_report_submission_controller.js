import MongooseClass from "../utils/database.js";
import flood_report_model from "../models/flood_report.js";
import Time from "../utils/time.js";

class FloodReport
{
  static async submit_report ( req, res ,io){
    const report = req.body;
    const imageBuffer = Buffer.from(report.image);
    const contentType = "image"
    if (!report.poster || !report.location || !report.image) {
      res.status(400).json({ error: "Required fields are missing" });
      return;
    }
    const flood_report = new flood_report_model( {
      poster: report.poster,
      image_source: {
        data: imageBuffer, 
        contentType: contentType
      },
      location: report.location,
      time: Time.get_time(),
    } );
    const result = await MongooseClass.insertRecord( flood_report )
    io.emit("new_flood_report");
    res.status( 201 ).json( { location: flood_report.location } );
  }

  static async get_report_history ( req, res ){
    const result = await MongooseClass.findAllRecords( flood_report_model);
    res.status(200).json({report_history: result});
  }
  
  static async delete_report(req, res) {
    const report_id = req.body.report_id;
    if (!report_id || report_id == "") {
      res.status(400).json( "error, report_id is required" );
      return;
    }
    try {
      await MongooseClass.deleteRecord(flood_report_model, { _id: report_id });
      res.status(204).json({ message: "delete report success" });
    } catch (error) {
      console.error("Error in delete_report:", error);
      res.status(404).json({ error: "report_id not found" });
    
    }
  
  }
  


  static async update_vote( req, res ){
    const report_id = req.body.report_id;
    const username = req.body.username;
    const vote_type = req.body.vote_type;
    if(!report_id || !username || !vote_type){
      res.status(400).json({error: "report_id, username, vote_type are required"});
      return;
    }
    if (vote_type != "upvote" && vote_type != "downvote"){
      res.status(400).json({error: "vote_type must be 'upvote' or 'downvote' not " + vote_type});
      return;
    }
    let record;
    try{
      record = await MongooseClass.findAllRecords( flood_report_model, {_id:report_id})
    }catch{
      res.status(404).json({error: "report_id not found"});
      return;
    }
    const voter_list = record[0].voter_list;
    if (voter_list.includes(username)){
      res.status(409).json({message: "You already voted"});
      return;
    }
    await MongooseClass.findAndUpdate( flood_report_model, {_id:report_id}, { $inc: { [vote_type]: 1 }, $addToSet:{voter_list: username} } )
    res.status(200).json({message: "vote success"});
  }
}

export default FloodReport;

