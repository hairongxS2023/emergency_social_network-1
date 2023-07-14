import MongooseClass from "../utils/database.js";
import volunteer_request_model from "../models/volunteer_request.js";
import Time from "../utils/time.js";
import volunteer_join_request_model from "../models/volunteer_join_request.js";

class volunteer_request
{
    static async searchVolunteerRequest ( req, res ) 
    {
        
        try
        {
            const result = await MongooseClass.findAllRecords( volunteer_request_model );
            console.log( "here are results" + result[ 0 ] );
            result.sort( function ( a, b )
            {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date( b.timesent ) - new Date( a.timesent );
            } );
            return res.render( "./volunteerRequestPage.ejs", { requests: result } );
        } catch ( err )
        {
            console.error( err );
            return res.status( 400 ).json( { error: 'error getting volunteer requests from volunteer controller' } );
        }
    }

    static async postInLastMin ( username )
    {
        const currentTime = Date.now();
        const oneMinAgo = currentTime - 10*1000;
        console.log( "current time: " + oneMinAgo );
        console.log( "current user:" + username );
        // Query the database for messages sent by the user within the past hour
        const recentPost = await volunteer_request_model.find( {
            user: username,
            timestamp: { $gt: oneMinAgo },
        } );
        console.log( "check if post in last min: " + recentPost );
        return recentPost.length;

    }

    static async submitPost ( req, res )
    {
        if ( !req.body.user || !req.body.type )
        {
            return res.status( 400 ).json( { error: "Bad Requests" } );
            
        }
        if ( !req.body.details )
        {
            return res.status( 400 ).json( { error: "no details" } );
        }
        let len = await this.postInLastMin( req.body.user );
        if ( len >= 1 )
        {
            return res.status( 429 ).json( { error: "submmited in one minute" } );
        }
        const msg_body = req.body;
        const timesent = Time.get_time();
        console.log( msg_body );
        
        console.log( "controller details" + msg_body.details );
        // MongooseClass.findAllRecords( volunteer_request_model, ).then( async ( result ) =>
        // {
        const volunteer_model = new volunteer_request_model( {
            user: msg_body[ "user" ],
            type: msg_body[ "type" ],
            details: msg_body.details, //list of sender
            timesent: timesent,
            volunteers_needed: msg_body[ "volunteers_needed" ],
            volunteers_joined: msg_body[ "volunteers_joined" ],
            fulfilled: msg_body[ "fulfilled" ]
        } );
        let returnId;
        try
        {
            const ret = await MongooseClass.insertRecord( volunteer_model );
            res.status( 200 ).json( { message: "Volunter Request Sent Successfully!", id: ret._id } );
        } catch ( err )
        {
            console.log( "error in volunteer controller" + err );
            res.status( 500 ).json( { error: "error in volunteer controller" } );
        }
        console.log( "at volunteer_controller.js, broadcast function, after mongodb insert" );
            //io.emit( "emit-volunteer-request", volunteer_model );
        // } )
        //MongooseClass.initDB();
    }

    static async addPersonToVolunteerRequest ( req, res )
    {
        if(!req.body.postID||!req.body.volunteer){
            return res.status(400).json({error:"Missing postid or volunteer "});
        }
        const id = req.body.postID;
        const volunteer = req.body.volunteer;
        //console.log("in admin" + username_here)
        const req_query = { _id: id };
        const update_query = { $push: { volunteers_joined: volunteer } };

        console.log( "in volunteer controller update volunteer: " + volunteer );
        console.log( "in volunteer controller update id: " + id );
        //MongooseClass.initDB();
        await MongooseClass
            .findAndUpdate(
                volunteer_request_model, req_query, update_query
            )
            .then( ( result ) =>
            {
                //MongooseClass.closeDB();
                //console.log("addmin_controller.js, ", result)
                res.status( 200 ).json( { message: "added the volunteer." } );
                console.log( "added to volunteer." + volunteer );
            } );

    }

    static async updateFulfilled ( req, res )
    {
        const id = req.params.postID;
        const exist = await volunteer_request_model.find( {
            _id: id,
        } );
        console.log(exist);
        if( exist.length < 1 ){
            return res.status( 400 ).json( { error: "no such post" } );
        }
        const req_query = { _id: id };

        const update_query = { fulfilled: true };

        await MongooseClass
            .findAndUpdate(
                volunteer_request_model, req_query, update_query
            )
            .then( ( result ) =>
            {
                //MongooseClass.closeDB();
                //console.log("addmin_controller.js, ", result)
                res.status( 200 ).json( { message: "updated the fulfilled." } );
            } );

    }

    static async manageVolunteerRequest ( req, res ) 
    {
        try
        {
            const username = req.params.username;
            const query = { user: username };
            const reqQuery = { requestor: username };
            const sortQuery = { timesent: -1 };
            const requestsRes = await MongooseClass.findAllRecords( volunteer_request_model, query, sortQuery );
            console.log( "ManageVolunteerRequest: here are results" + requestsRes[ 0 ] );
            const joinRequestsRes = await MongooseClass.findAllRecords( volunteer_join_request_model, reqQuery, sortQuery );
            console.log( "ManageVolunteerRequestJoin: here are results" + joinRequestsRes[ 0 ] );
            return res.render( "./manageVolunteerRequest.ejs", { requests: requestsRes, joinRequests: joinRequestsRes } );
        } catch ( err )
        {
            console.error( err );
            return res.status( 400 ).json( { error: 'error getting volunteer requests from volunteer controller' } );
        }
    }

    static async deleteJoinRequest ( req, res )
    {
        if(!req.body.postID){
            return res.status(400).json({error:"Missing postid "});
        }
        if(!req.body.volunteer){
        
            return res.status(429).json({error:"Missing volunteer "});
        }
        const id = req.body.postID;
        const volunteer = req.body.volunteer;

        const req_query = { postID: id, username: volunteer };
        console.log( "in deleteJoinRequest" + id );
        console.log( "in volunteer:" + volunteer );

        //MongooseClass.initDB();
        await MongooseClass
            .deleteRecord(
                volunteer_join_request_model, req_query, false, true
            )
            .then( ( result ) =>
            {
                //MongooseClass.closeDB();
                //console.log("addmin_controller.js, ", result)
                res.status( 200 ).json( { message: "updated the fulfilled." } );
                console.log( "updated the delete request" + id );
            } );

    }



    //two functions below may need to replace into notification controller


}

export default volunteer_request;
