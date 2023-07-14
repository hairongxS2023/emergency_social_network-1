import volunteerRequest from "../../controller/volunteer_controller.js";
import MongooseClass from "../../utils/database.js"
import { createRequest, createResponse } from 'node-mocks-http';
import { jest } from '@jest/globals'
import volunteer_request_model from "../../models/volunteer_request.js";
import volunteer_join_request_model from "../../models/volunteer_join_request.js";
import { ObjectId } from "mongodb";



describe( "load volunteer request", () =>
{
    let testID;
    // const mockIo = {
    //     emit: jest.fn(),
    // };
    beforeAll( async () =>
    {
        await MongooseClass.initDB();
    } );

    afterEach( () =>
    {
        jest.clearAllMocks();
    } );


    test( "test1 submitPost function, should response with status code 200 and correct submission", async () =>
    {
        // MongooseClass.findAllRecords = jest.fn().mockImplementation(() => {
        //   });
        MongooseClass.insertRecord = jest.fn().mockResolvedValue(
            {
                _id: "123456654321",
            }//mock mongoose methods
        );
        const req = createRequest();
        const res = createResponse();
        req.body = {
            user: "testnamefromVolunteerJest",
            type: "test type",
            details: "test details",
            timesent: "12:00:00 2021-01-01",
            volunteers_needed: 1,
            volunteers_joined: [],
            fulfilled: false,
            //a test 1*1 pixel png image
        };
        await volunteerRequest.submitPost( req, res );
        expect( res.statusCode ).toBe( 200 );
        expect( res._getJSONData() ).toEqual( {
            id: "123456654321",
            message: "Volunter Request Sent Successfully!",
        } );
    }, 15000 );

    test( "test2 get all request function, should response with status code 200 and correct insertion", async () =>
    {
        const req = createRequest();
        const res = createResponse();
        const newModel = new volunteer_request_model( {
            "user": "test123455",
            "type": "Water Supply",
            "details": "This is a test",
            "timesent": "4/14/2023, 12:59:40 PM",
            "volunteers_needed": 1,
            "volunteers_joined": [],
            "fulfilled": false,
        } );

        MongooseClass.findAllRecords = jest.fn().mockResolvedValue(
            {
                "user": "test123455",
                "type": "Water Supply",
                "details": "This is a test",
                "timesent": "4/14/2023, 12:59:40 PM",
                "volunteers_needed": 1,
                "volunteers_joined": [],
                "fulfilled": false,
            }//mock mongoose methods
        );

        //await MongooseClass.insertRecord( newModel );
        await volunteerRequest.searchVolunteerRequest( req, res )
            .then( ( result ) =>
            {
                expect( res.statusCode ).toBe( 400 );
            } );
    }, 15000 );

    test( "test3 add person to volunteer request function, should response with status code 200 and correct message", async () =>
    {
        const req = createRequest();
        const res = createResponse();
        MongooseClass.insertRecord = jest.fn().mockResolvedValue(
            {
                _id: "123456654321",
            }//mock mongoose methods
        );
        console.log( "this is test id" + testID );
        req.body = {
            postID: "123456654321",
            volunteer: "testvolunteer"
        };

        await volunteerRequest.addPersonToVolunteerRequest( req, res );
        expect( res.statusCode ).toBe( 200 );
        expect( res._getJSONData() ).toEqual( { message: "added the volunteer." } );
    }, 10000 );

    test( "test4 update fulfill function, should response with status code 200 and correct message", async () =>
    {
        const req = createRequest();
        const res = createResponse();
        volunteer_request_model.find = jest.fn().mockResolvedValue( [ 1, 2 ] );
        MongooseClass.findAndUpdate = jest.fn().mockResolvedValue(
        );
        req.params = {
            postID: "123456654321",
        };

        await volunteerRequest.updateFulfilled( req, res );
        expect( res.statusCode ).toBe( 200 );
        expect( res._getJSONData() ).toEqual( { message: "updated the fulfilled." } );
    }, 10000 );

    test( "test5 manage volunteer request function, should response with status code 200 and correct message", async () =>
    {
        const req = createRequest();
        const res = createResponse();

        req.params = {
            username: "testusername",
        };
        MongooseClass.findAllRecords = jest.fn().mockResolvedValue( [ 1, 2 ] );

        await volunteerRequest.manageVolunteerRequest( req, res );
        expect( res.statusCode ).toBe( 200 );
        //expect( res._getJSONData() ).toEqual( { message: "updated the fulfilled." } );
    }, 10000 );

    test( "test6 delete volunteer request function, should response with status code 200 and correct message", async () =>
    {
        const req = createRequest();
        const res = createResponse();

        req.body = {
            postID: "643a47173c5481049ad7dc10",
            username: "testvolunteer"
        };

        await volunteerRequest.deleteJoinRequest( req, res );
        expect( res.statusCode ).toBe( 200 );
        expect( res._getJSONData() ).toEqual( { message: "updated the fulfilled." } );
    }, 10000 );

    test( "test7 submitPost function failure, should response with status code 400  and wrong input", async () =>
    {
        const req = createRequest();
        const res = createResponse();
        req.body = {
            //test with no user
            type: "test type",
            details: "test details",
            timesent: "12:00:00 2021-01-01",
            volunteers_needed: 1,
            volunteers_joined: [],
            fulfilled: false,
            //a test 1*1 pixel png image
        };
        await volunteerRequest.submitPost( req, res );
        // console.log(res._getJSONData());
        expect( res.statusCode ).toBe( 400 );
        //console.log(res._getData());
        expect( res._getJSONData() ).toEqual( { "error": "Bad Requests" } );
    }, 15000 );

    test( "test8 submitPost function failure with no details, should response with status code 400  and wrong input", async () =>
    {
        const req = createRequest();
        const res = createResponse();
        req.body = {
            user: "testuser",
            type: "test type",
            //details: "test details",
            timesent: "12:00:00 2021-01-01",
            volunteers_needed: 1,
            volunteers_joined: [],
            fulfilled: false,
            //a test 1*1 pixel png image
        };
        await volunteerRequest.submitPost( req, res );
        // console.log(res._getJSONData());
        expect( res.statusCode ).toBe( 400 );
        //console.log(res._getData());
        expect( res._getJSONData() ).toEqual( { error: "no details" } );
    }, 15000 );

    test( "test9 add person to volunteer request function failure, should response with status code 400 and incorrect message", async () =>
    {
        const req = createRequest();
        const res = createResponse();
        console.log( "this is test id" + testID );
        req.body = {
            //no id
            //postID: "6439d0af596f5110ce92ab7c",
            //volunteer: "testvolunteer"
        };

        await volunteerRequest.addPersonToVolunteerRequest( req, res );
        expect( res.statusCode ).toBe( 400 );
        expect( res._getJSONData() ).toEqual( { "error": "Missing postid or volunteer " } );
    }, 10000 );


    test( "test10 update fulfill function failure, should response with status code 400 and incorrect message", async () =>
    {
        const req = createRequest();
        const res = createResponse();

        //if mongoose find returns empty array
        volunteer_request_model.find = jest.fn().mockResolvedValue([]);
        MongooseClass.findAndUpdate = jest.fn().mockResolvedValue(
        );
        req.params = {
            postID: "123123123",
        };

        await volunteerRequest.updateFulfilled( req, res );
        expect( res.statusCode ).toBe( 400 );
        expect( res._getJSONData() ).toEqual( { error: "no such post" } );
    }, 10000 );

    test( "test11 manage volunteer request function failure, should response with status code 400 and correct message", async () =>
    {
        const req = createRequest();
        const res = createResponse();

        req.params = {
            username: "testusername",
        };

        await volunteerRequest.manageVolunteerRequest( req, res );
        expect( res.statusCode ).toBe( 200 );
        //expect( res._getJSONData() ).toEqual( { message: "updated the fulfilled." } );
    }, 10000 );

    test( "test12 delete volunteer request function failure, should response with status code 204 and correct message", async () =>
    {
        const req = createRequest();
        const res = createResponse();

        req.body = {
            //postID: "643a47173c5481049ad7dc10",
            //missing volunteer
            volunteer: "testvolunteer"
        };

        await volunteerRequest.deleteJoinRequest( req, res );
        expect( res.statusCode ).toBe( 400 );
        expect( res._getJSONData() ).toEqual( { error: "Missing postid " } );
    }, 10000 );

    test( "test13 delete volunteer request function failure, should response with status code 204 and correct message", async () =>
    {
        const req = createRequest();
        const res = createResponse();

        req.body = {
            postID: "643a47173c5481049ad7dc10",
            //missing volunteer
            //volunteer: "testvolunteer"
        };

        await volunteerRequest.deleteJoinRequest( req, res );
        expect( res.statusCode ).toBe( 429 );
        expect( res._getJSONData() ).toEqual( { error: "Missing volunteer " } );
    }, 10000 );


} );


//jest.useFakeTimers()
