import MongooseClass from "../utils/database.js";
import volunteer_request_model from "../models/volunteer_request.js";
import volunteer_join_model from "../models/volunteer_join_request.js";
import Time from "../utils/time.js"
import volunteer_join_request_model from "../models/volunteer_join_request.js";

class volunteer_Join
{

    static async searchVolunteerRequest ( req, res ) 
    {
        try{          
            const id = req.params.postID;
            console.log( "here is id from join controller search:\n" + id)
            const result = await MongooseClass.findAllRecords( volunteer_request_model,{_id:id} );
            console.log( "here is details from:\n" + result );
            return res.render( "./joinAsVolunteer.ejs", { currRequest: result[0] } );
        } catch ( err ){
            console.error( err );
            return res.status( 400 ).json( { error: 'volunteer join controller: error getting volunteer requests' } );
        }
    }

    static async submitRequest ( req, res ) 
    {
        if ( !req.body.username)
        {
            return res.status( 400 ).json( { error: "name cannot be empty" } );

        }
        console.log( "here is the body from join controller:\n" + req.body.username );
        const len = await this.postInLastHour( req.body.username );
        if ( len > 0 ){
            return res.status( 429 ).json( { error: 'can only request in one hour' } );
        }
        try
        {
            console.log( "here is the body from join controller inside:\n" + req.body.username );
            const new_volunteer_join = new volunteer_join_model({
                postID: req.body.postID,
                requestor: req.body.requestor,
                username: req.body.username,
                reason: req.body.reason,
                timesent: Time.get_time(),
            });
            try{
                await new_volunteer_join.save();
            console.log( "here is id from join controller:\n" + req.body.postID)
            res.status( 201 ).json( { message: "New join request posted" } );
            }catch(err){
                console.error( err );
                return res.status( 400 ).json( { error: 'error saving volunteer join request' } );
            }
                   } catch ( err )
        {
            console.error( err );
            return res.status( 400 ).json( { error: 'error getting volunteer join requests' } );
        }
    }

    static async postInLastHour ( username )
    {
        const currentTime = Date.now();
        const oneHourAgo = currentTime -1000;
        console.log( "current time: " + oneHourAgo );
        console.log( "current user:" + username );
        const recentJoin = await volunteer_join_request_model.find( {
            username: username,
            timestamp: { $gt: oneHourAgo },
        } );
        console.log( "check if post in last min: " + recentJoin );
        return recentJoin.length;
    }

    static async deleteJoinRequest ( req, res )
    {
        if ( !req.username )
        {
            return res.status( 400 ).json( { error: "username cannot be empty for deletion" } );

        }
        const username = req.username;
        //console.log("in admin" + username_here)
        const req_query = { username: username };
        const up_query = {$push:{ authority: "administrator" }};
        //MongooseClass.initDB();
        await MongooseClass
            .findAndUpdate(
                volunteer_join_request_model, req_query, up_query
            )
            .then( ( result ) =>
            {
                //MongooseClass.closeDB();
                //console.log("addmin_controller.js, ", result)
                res.status( 200 ).json( { message: "updated to fulfilled." } );
                console.log( "updated to administrator." );
            } );
    }

}
export default volunteer_Join;