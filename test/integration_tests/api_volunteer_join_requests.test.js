import axios from 'axios';
import { expect } from 'chai';
import Auth from '../../middleware/auth.js';
import MongooseClass from '../../utils/database.js';
import volunteer_request_model from '../../models/volunteer_request.js';
import volunteer_join_request_model from '../../models/volunteer_join_request.js';
import { param } from 'express-validator';

const api = axios.create( {
    baseURL: 'http://localhost:5003',
    headers: { contentType: 'application/json; charset=utf-8' },
    timeout: 10000,
} );

describe( '/volunteer-join-requests success API cases', () =>
{
    let jwtToken;
    let eventId;
    beforeAll( async () =>
    {
        const payload = { username: 'testname', authority: 'citizen' };
        jwtToken = await Auth.genToken( payload );

    } );

    test( '1. POST /request-submissions for testing following join requests should create a new emergency event and return 200 status', async () =>
    {
        try
        {
            const requestBody = {
                user: 'testingRequestor',
                type: 'testtype',
                details: 'testing for join requests',
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
            console.log( error );
            throw error;
        }
    } );

    test( '2. POST /volunteer-join-requests should create a new emergency event and return 200 status', async () =>
    {
        try
        {
            const requestBody = {
                postID: eventId,
                requestor: "testingrequestor",
                username: "testingusername",
                reason: "testing reason",
                timesent: "4/14/2023, 8:51:43 PM",
                
            };

            const response = await api.post( '/volunteer-join-requests', requestBody, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
            } );
            expect( response.status ).to.equal( 201 );
            expect( response.data ).to.include( { message: "New join request posted" } );
        } catch ( error )
        {
            console.log( error );
            throw error;
        }
    } );

    test( '3. GET /volunteer-join-requests should return a volnteer request and return 200 status', async () =>
    {
        try
        {

            const response = await api.get( `/volunteer-join-requests/${eventId}`, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
            } );
            expect( response.status ).to.equal( 200 );
            expect( response.data ).to.be.an('string' );
        } catch ( error )
        {
            console.log( error );
            throw error;
        }
    } );

    test( '4. PUT /volunteer-requests-deletion should update the emergency volunteer request and return 200 status', async () =>
    {
        try
        {

            const requestBody = {
                postID: eventId,
                username: "testingusername",
            };

            console.log( "eventid:" + eventId );
            //const params = {params: eventId};
            const response = await api.put( `/volunteer-requests-deletion`, requestBody, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
                data: {}
            } );

            expect( response.status ).to.equal( 200 );
            expect( response.data ).to.include( { message: "updated the fulfilled." } );
        } catch ( error )
        {
            //console.log( error );
            throw error;
        }
    }, 15000 );

});

describe( '/volunteer-join-requests API failure cases', () =>
{
    let jwtToken;
    const nonExistentEventId = '64345b45644e3fa2572afff0';

    beforeAll( async () =>
    {
        const payload = { username: 'testname', authority: 'citizen' };
        jwtToken = await Auth.genToken( payload );

    } );

    test( '5. POST /request-submissions with missing required fields should return 400 status', async () =>
    {
        try
        {
            const requestBody = {
                // Missing 'username' and 'announcement_content'
            };

            await api.post( '/volunteer-join-requests', requestBody, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
            } );
        } catch ( error )
        {
            //console.log(error);{ error: "name cannot be empty" } 
            expect( error.response.status ).to.equal( 400 );
            expect( error.response.data ).to.include( { error: "name cannot be empty" } );
        }
    } );

    test( '6. PUT /volunteer-requests-deletion should update the emergency volunteer request and return 200 status', async () =>
    {
        try
        {

            const requestBody = {
                //missing username and reason
            };

            //console.log( "eventid:" + eventId );
            //const params = {params: eventId};
            const response = await api.put( `/volunteer-requests-deletion`, requestBody, {
                headers: { 'Cookie': `access_token=${ jwtToken }` },
                data: {}
            } );

            
        } catch ( error )
        {
            //console.log( error );
            expect( error.response.status ).to.equal( 400 );
            expect( error.response.data ).to.include( { error: "Missing postid "}  );
            //throw error;
        }
    }, 15000 );

});
