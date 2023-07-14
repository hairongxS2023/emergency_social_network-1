import volunteer_join_controller from "../../controller/volunteer_join_controller.js";
import MongooseClass from "../../utils/database.js"
import { createRequest, createResponse } from 'node-mocks-http';
import { jest } from '@jest/globals'
import volunteer_request_model from "../../models/volunteer_request.js";
import volunteer_join_request_model from "../../models/volunteer_join_request.js";
import { ObjectId } from "mongodb";



describe( "join controller test", () =>
{
    let testID;
    // const mockIo = {
    //     emit: jest.fn(),
    // };
    beforeAll( async () =>
    {
        await MongooseClass.connectLocalDB();
    } );

    afterEach( () =>
    {
        jest.clearAllMocks();
    } );


    test( "test1 searchVolunteerRequest function, should response with status code 200 status", async () =>
    {
        // MongooseClass.findAllRecords = jest.fn().mockImplementation(() => {
        //   });
        MongooseClass.findAllRecords = jest.fn().mockResolvedValue(
            {
                _id: "123456654321",
            }//mock mongoose methods
        );
        const req = createRequest();
        const res = createResponse();
        await volunteer_join_controller.searchVolunteerRequest( req, res );
        expect( res.statusCode ).toBe( 200 );
        // expect( res._getJSONData() ).toEqual( {
        //     id: "123456654321",
        //     message: "Volunter Request Sent Successfully!",
        // } );
    }, 15000 );

    test( "test2 submit Request function, should response with status code 200 and correct status", async () =>
    {
        let req = createRequest();
        const res = createResponse();
        
        req.body = {
            username:"testnamefromVolunteerJest",
        }
        req.body.username = "asdfd";
        const new_model = new volunteer_join_request_model( {
            postID: "123456654321",
            requestor: "mock requestor",
            username: "testing username",
            reason: "testing reason",
            timesent: "12:00:00 2021-01-01",

        } );
        volunteer_join_controller.postInLastHour = jest.fn().mockResolvedValue( 1);
        MongooseClass.insertRecord = jest.fn().mockResolvedValue(
            {
            }//mock mongoose methods
        );
        new_model.save = jest.fn().mockResolvedValue(
        {});
        //await MongooseClass.insertRecord( newModel );
        await volunteer_join_controller.submitRequest( req, res )
            .then( ( result ) =>
            {
                expect( res.statusCode ).toBe( 429);
            } );
    }, 15000 );

    test( "test3 add person to volunteer request function, should response with status code 204 and correct message", async () =>
    {
        const req = createRequest();
        const res = createResponse();
        req.username = "testnamefromVolunteerJest";
        MongooseClass.findAndUpdate = jest.fn().mockResolvedValue(
            {
                _id: "123456654321",
            }//mock mongoose methods
        );

        await volunteer_join_controller.deleteJoinRequest( req, res );
        expect( res.statusCode ).toBe( 200 );
        expect( res._getJSONData() ).toEqual( { message: "updated to fulfilled." } );
    }, 10000 );



    test( "test4 submit Requestfunction failure, should response with status code 400 and incorrect message", async () =>
    {
        const req = createRequest();
        const res = createResponse();
        req.body = {
            //username: "testnamefromVolunteerJest",
            //missing username
        }
        const new_model = new volunteer_join_request_model( {
            postID: "123456654321",
            requestor: "mock requestor",
            username: "testing username",
            reason: "testing reason",
            timesent: "12:00:00 2021-01-01",

        } );
        MongooseClass.insertRecord = jest.fn().mockResolvedValue(
            {
            }//mock mongoose methods
        );
        //await MongooseClass.insertRecord( newModel );
        await volunteer_join_controller.submitRequest( req, res )
            .then( ( result ) =>
            {
                expect( res.statusCode ).toBe( 400 );
            } );
    }, 15000 );

    test( "test5 add person to volunteer request function failure, should response with status code 400 and incorrect message", async () =>
    {
        const req = createRequest();
        const res = createResponse();
        //no username
        //req.username = "testnamefromVolunteerJest";
        MongooseClass.findAndUpdate = jest.fn().mockResolvedValue(
            {
                _id: "123456654321",
            }//mock mongoose methods
        );

        await volunteer_join_controller.deleteJoinRequest( req, res );
        expect( res.statusCode ).toBe( 400 );
        expect( res._getJSONData() ).toEqual( { error: "username cannot be empty for deletion" } );
    }, 10000 );

    test( "test6 test if post in last hour, should response with status code 400 and incorrect message", async () =>
    {
        const req = createRequest();
        const res = createResponse();
        let testing1 = "123456654321"
        //no username
        //req.username = "testnamefromVolunteerJest";
        volunteer_join_request_model.find = jest.fn().mockResolvedValue(
            {
                _id: "123456654321",
            }//mock mongoose methods
        );

        //await volunteer_join_controller.postInLastHour(testing1 );
        let result = await volunteer_join_controller.postInLastHour(testing1);
        expect( result ).toBe(1);
        //expect( res.statusCode ).toBe( 400 );
        //expect( res._getJSONData() ).toEqual( { error: "username cannot be empty for deletion" } );
    }, 10000 );


   


} );


//jest.useFakeTimers()
