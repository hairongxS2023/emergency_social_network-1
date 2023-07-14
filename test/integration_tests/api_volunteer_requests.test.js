import axios from 'axios';
import { expect } from 'chai';
import Auth from '../../middleware/auth.js';
import MongooseClass from '../../utils/database.js';
import volunteer_request_model from '../../models/volunteer_request.js';
import volunteer_join_request_model from '../../models/volunteer_join_request.js';
import { param } from 'express-validator';
import e from 'express';

const api = axios.create( {
    baseURL: 'http://localhost:5003',
    headers: { contentType: 'application/json; charset=utf-8' },
    timeout: 30000,
} );

describe( '/volunteer-requests success API cases', () =>
{
    let jwtToken;
    let eventId;

    beforeAll( async () =>
    {
        const payload = { username: 'testname', authority: 'citizen' };
        jwtToken = await Auth.genToken( payload );

        
    } );


    test( '1. POST /request-submissions should create a new emergency event and return 200 status', async () =>
    {
        try
        {
            const requestBody = {
                user: 'testing',
                type: 'testtype',
                details: 'testdetails',
                volunteers_needed: 1,
                volunteers_joined: [ 'testVolunteer1', 'testvolunteer2' ],
                timesent: '2021-05-01T00:00:00.000Z',
                fulfilled: false,
            };

            const response = await api.post( '/request-submissions', requestBody, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
            } );
            eventId = response.data.id;
            expect( response.status ).to.equal( 200 );
            expect( response.data ).to.include( { "message": "Volunter Request Sent Successfully!" } );
        } catch ( error )
        {
            //console.log( error );
            throw error;
        }
    } );

    

    test( '2. GET /volunter-requests should return all emergency events with 200 status', async () =>
    {
        try
        {
            const response = await api.get( '/volunteer-requests', {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
            } );

            expect( response.status ).to.equal( 200 );
            //console.log( response.data );
            expect( response.data ).to.be.a('string' );
        } catch ( error )
        {
            //console.log( error );
            throw error;
        }
    } );
    

    test( '3. PUT /requests-fulfillment should update the emergency volunteer request and return 200 status', async () =>
    {
        try
        {   
            
            const requestBody = {
            };

            console.log("eventid:"+eventId);
            //const params = {params: eventId};
            const response = await api.put( `/requests-fulfillment/${ eventId }`, requestBody,{
                headers: { 'Cookie': `access_token=${ jwtToken }` },
                data:{}
            } );
            
            expect( response.status ).to.equal( 200 );
            expect( response.data ).to.include( { message: "updated the fulfilled." } );
        } catch ( error )
        {
            //console.log( error );
            throw error;
        }
    },15000);

} );

describe( '/volunteer-requests API failure cases', () =>
{
    let jwtToken;
    const nonExistentEventId = '64345b45644e3fa2572afff0';

    beforeAll( async () =>
    {
        const payload = { username: 'testname', authority: 'citizen' };
        jwtToken = await Auth.genToken( payload );

        // await MongooseClass.initDB();
        // await MongooseClass.init_test_DB();
        //await generateRecords();
        // const result = await MongooseClass.findAllRecordsX( volunteer_request_model );
        // eventId = result[ 0 ]._id;
        // console.log( "beforeAll: here are results" + result );
    });

    test( '4. POST /request-submissions with missing required fields should return 400 status', async () =>
    {
        try
        {
            const requestBody = {
                // Missing 'username' and 'announcement_content'
            };

            await api.post( '/request-submissions', requestBody, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
            } );
        } catch ( error )
        {   
            //console.log(error);
            expect( error.response.status ).to.equal( 400 );
        }
    } );

    test( '5. POST /request-submissions with missing required fields should return 400 status with condition', async () =>
    {
        try
        {
            const requestBody = {
                user: 'testna32wewe',
                type: 'testtype',
            };

            // adding 'username' and 'announcement_content'

            await api.post( '/request-submissions', requestBody, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
            } );
        } catch ( error )
        {
            //console.log( error );
            expect( error.response.status ).to.equal( 400 );
            expect( error.response.data ).to.include( { error: "no details" } );

        }
    } );

    test( '6. PUT /requests-fulfillment with a wrong id should return 400 status with condition of no post found', async () =>
    {
        try
        {

            const requestBody = {
                // Missing 'username' and 'announcement_content'
            };

            //const params = {params: eventId};
            const response = await api.put( `/requests-fulfillment/${ nonExistentEventId }`, requestBody, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
                data:{}
            } );

        } catch ( error )
        {
            //console.log( error );
            expect( error.response.status ).to.equal( 400 ) ;
            expect( error.response.data ).to.include({error:'no such post'});
        }
    } );

    test( '7. PUT /volunteer-requests-update should update the emergency volunteer request and return 200 status', async () =>
    {
        try
        {

            const requestBody = {
                //missing postID or volunteer
            };

            //const params = {params: eventId};
            const response = await api.put( `/volunteer-requests-update`, requestBody, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },

            } );

        } catch ( error )
        {
            //console.log( error );
            expect( error.response.status).to.equal( 400 );
            expect( error.response.data ).to.include( { error: "Missing postid or volunteer " } );
        }
    } );

    test( '8. POST /request-submissions within a minute should return 429 status', async () =>
    {
        try
        {
            const requestBody = {
                user: 'thisshouldnotwork',
                type: 'testtype',
                details: 'testdetails',
                volunteers_needed: 1,
                volunteers_joined: [ 'testVolunteer1', 'testvolunteer2' ],
                timesent: '2021-05-01T00:00:00.000Z',
                fulfilled: false,
            };

            const response = await api.post( '/request-submissions', requestBody, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
            } );
            // eventId = response.data.id;
            // expect( response.status ).to.equal( 200 );
            // expect( response.data ).to.include( { "message": "Volunter Request Sent Successfully!" } );
        } catch ( error )
        {
            //console.log( error );
            expect( error.response.status ).to.equal( 429 );
            expect( error.response.data ).to.include( { error: "submmited in one minute" } );
        }
    } );

    
   
});

// async function generateRecords ()
// {
//     const newModel1 = new volunteer_request_model( {
//         "user": "test123455",
//         "type": "Water Supply",
//         "details": "This is a test",
//         "timesent": "4/14/2023, 12:59:40 PM",
//         "volunteers_needed": 1,
//         "volunteers_joined": [],
//         "fulfilled": false,
//         "__v": 0
//     } );
    

//     await MongooseClass.insertRecord( newModel1 );
//     return;
// }