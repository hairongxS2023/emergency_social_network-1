import FloodReport from "../../controller/flood_report_submission_controller.js";
import FloodReportModel from "../../models/flood_report.js";
import MongooseClass from "../../utils/database.js";
import {createRequest, createResponse} from "node-mocks-http";
import {ObjectId} from "mongodb";
import { jest } from '@jest/globals'

beforeAll(async ()=>{
  const mockedRecords = [
    {
      report_id: "1",
      poster: "testname1",
      location: "CMU silicon valley",
      image_source: {
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        contentType: "image",
      },
      time: "2021-05-01T00:00:00.000Z",
      upvote: 0,
      downvote: 0,
      voter_list: [],
    },
   {
      report_id: "2",
      poster: "testname2",
      location: "CMU silicon valley",
      image_source: {
          data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
          contentType: "image",
      },
      time: "2022-05-01T00:00:00.000Z",
      upvote: 0,
      downvote: 0,
      voter_list: [],
    },
    {
      report_id: "3",
      poster: "testname3",
      location: "CMU silicon valley",
      image_source: {
          data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
          contentType: "image",
      },
      time: "2022-05-01T00:00:00.000Z",
      upvote: 0,
      downvote: 0,
      voter_list: [],
    }
  ];
    MongooseClass.initDB = jest.fn();
    MongooseClass.switch_to_test_DB = jest.fn();
    MongooseClass.deleteRecord = jest.fn();
    MongooseClass.insertRecord = jest.fn();
    MongooseClass.deleteRecord = jest.fn((FloodReportModel, condition) => {
      const index = mockedRecords.findIndex(record => record.report_id === condition._id);
      if (index !== -1) {
        mockedRecords.splice(index, 1);
        return Promise.resolve(true);
      } else {
        return Promise.reject(new Error('Record not found'));
      }
    });
    MongooseClass.findAndUpdate = jest.fn((FloodReportModel, condition, update) => {
      const index = mockedRecords.findIndex(record => 
        record.report_id === condition._id
      );
      if (index !== -1) {
        if (update.$inc) {
          for (const key in update.$inc) {
            mockedRecords[index][key] += update.$inc[key];
          }
        }
        if (update.$addToSet) {
          for (const key in update.$addToSet) {
            if (!mockedRecords[index][key].includes(update.$addToSet[key])) {
              mockedRecords[index][key].push(update.$addToSet[key]);
            }
          }
        }
        return Promise.resolve(true);
      } else {
        return Promise.reject(new Error('Record not found'));
      }
    });
    
    MongooseClass.findAllRecords = jest.fn((FloodReportModel, condition) => {
      if (!condition) {
        return Promise.resolve(mockedRecords);
      } else {
        const record = mockedRecords.find((record) => record.report_id === condition._id);
        if (record) {
          return Promise.resolve([record]);
        } else {
          return Promise.reject(new Error('Record not found'));
        }
      }
    });
    
    await MongooseClass.initDB();
    await MongooseClass.switch_to_test_DB();
})

describe ("Testing flood report submission controller", () => {
    test("test1 submit report function, should response with status code 201 and coorect location", async ()=>{
        const req = createRequest();
        const res = createResponse();
        req.body = {
            poster: "testname",
            location: "CMU silicon valley",
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            //a test 1*1 pixel png image
        };
        await FloodReport.submit_report(req, res);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({ location: "CMU silicon valley" });
    }, 15000);


    // test("test submit report function,should response with error code 400, and response json contains error", async ()=>{
    //     const req = createRequest();
    //     const res = createResponse();
    //     req.body = {
    //         poster: "",
    //         location: "",
    //         image: "",
    //     };
    //     await FloodReport.submit_report(req, res);
    //     expect(res.statusCode).toBe(400);
    //     expect(res._getJSONData()).toEqual({ error: "lacking information" });
    // });

    test("test2 get report history function, should response with status code 200 and correct report history", async () => {
        const req = createRequest();
        const res = createResponse();
        const newModel = new FloodReportModel({
          poster: "testname",
          location: "CMU silicon valley",
          image_source: {
            data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            contentType: "image",
          },
          time: "2021-05-01T00:00:00.000Z",
        });
    
        await MongooseClass.insertRecord(newModel);
        FloodReport.get_report_history(req, res)
            .then((result)=>{
                expect(res.statusCode).toBe(200);
            });
      }, 15000);

      test("test3 delete report function, should response with status code 204 and correct message", async () => {
        const req = createRequest();
        const res = createResponse();
        const newModel = new FloodReportModel({
          poster: "testname",
          location: "CMU silicon valley",
          image_source: {
            data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            contentType: "image",
          },
          time: "2021-05-01T00:00:00.000Z",
        });
      
        await MongooseClass.insertRecord(newModel);
        req.body = {
          report_id: "1",
        };
      
        await FloodReport.delete_report(req, res);
        expect(res.statusCode).toBe(204);
        expect(res._getJSONData()).toEqual({ message: "delete report success" });
      }, 10000);
      


      test("test4 delete report function, should response with status code 400 and error message", async () => {
        const req = createRequest();
        const res = createResponse();
        req.body = {
            report_id: "wrong_ID",
        };
        await FloodReport.delete_report(req, res);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toHaveProperty("error");
      }, 10000);


      test("test5 update_vote function, should response with status code 200 and success message", async () => {
        const req = createRequest();
        const res = createResponse();

        req.body = {
          report_id: "2",
          username: "testuser",
          vote_type: "upvote",
        };
      
        await FloodReport.update_vote(req, res);
        expect(res.statusCode).toBe(200);
      
        // Test if the vote has been added
        const updatedModel = await MongooseClass.findAllRecords(FloodReportModel, { _id: "2"});
        expect(updatedModel[0].upvote).toBe(1);
        expect(updatedModel[0].voter_list).toContain("testuser");
      }, 10000);
      
      test("test6 update_vote function, should response with status code 409 and error message", async () => {
        const req = createRequest();
        const res = createResponse();
      
        req.body = {
          report_id: "2",
          username: "testuser",
          vote_type: "upvote",
        };
      
        await FloodReport.update_vote(req, res);
        expect(res.statusCode).toBe(409);
        expect(res._getJSONData()).toEqual({ message: "You already voted" });
      }, 10000);
      

      test("test7 submit_report function, should response with status code 400 and error message", async () => {
        const req = createRequest();
        const res = createResponse();
        req.body = {
          poster: "",
          location: "",
          image: "",
        };
        await FloodReport.submit_report(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toHaveProperty("error");
      }, 10000);
      
      test("test8 delete_report function with non-existent report ID, should response with status code 404 and error message", async () => {
        const req = createRequest();
        const res = createResponse();
        req.body = {
          report_id: "randomMongoID",
        };
        await FloodReport.delete_report(req, res);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toHaveProperty("error");
      }, 10000);

      test("test9 update_vote function with non-existent report ID, should response with status code 404 and error message", async () => {
        const req = createRequest();
        const res = createResponse();
        req.body = {
          report_id: "randomMongoID",
          username: "testuser2",
          vote_type: "upvote",
        };
        await FloodReport.update_vote(req, res);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toHaveProperty("error");
      }, 10000);
      

      test("test10 update_vote function with invalid vote_type, should response with status code 400 and error message", async () => {
        const req = createRequest();
        const res = createResponse();
        const newModel = new FloodReportModel({
            poster: "testname",
            location: "CMU silicon valley",
            image_source: {
              data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
              contentType: "image",
            },
            time: "2021-05-01T00:00:00.000Z",
            up_vote: 0,
            down_vote: 0,
            voter_list: [],
            _id: randomMongoID(), //random id
          });
        
        await MongooseClass.insertRecord(newModel);
        req.body = {
          report_id: newModel._id,
          username: "testuser",
          vote_type: "invalid_vote_type",
        };
        await FloodReport.update_vote(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toHaveProperty("error");
      }, 10000);
      

      test("test11 update_vote function, vote up and down, should response with status code 200 and updated vote counts", async () => {
        const reqUp = createRequest();
        const resUp = createResponse();
        
        reqUp.body = {
          report_id: "3",
          username: "testuser2",
          vote_type: "upvote",
        };
        await FloodReport.update_vote(reqUp, resUp);
        expect(resUp.statusCode).toBe(200);
      
        const reqDown = createRequest();
        const resDown = createResponse();
        reqDown.body = {
          report_id: "3",
          username: "testuser3",
          vote_type: "downvote",
        };
        await FloodReport.update_vote(reqDown, resDown);
        expect(resDown.statusCode).toBe(200);
        
        // Test if the vote counts have been updated
        const updatedModel = await MongooseClass.findAllRecords(FloodReportModel, { _id: "3" });
        expect(updatedModel[0].upvote).toBe(1);
        expect(updatedModel[0].downvote).toBe(1);
        expect(updatedModel[0].voter_list).toContain("testuser2");
        expect(updatedModel[0].voter_list).toContain("testuser3");
        }, 10000);
        
        test("test12 delete report function without report_id, should response with status code 400 and error message", async () => {
          const req = createRequest();
          const res = createResponse();
          const newModel = new FloodReportModel({
            poster: "testname",
            location: "CMU silicon valley",
            image_source: {
              data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
              contentType: "image",
            },
            time: "2021-05-01T00:00:00.000Z",
          });
          await MongooseClass.insertRecord(newModel);
          req.body = {
              report_id: "",
          };
          await FloodReport.delete_report(req, res);
          expect(res.statusCode).toBe(400);
          expect(res._getJSONData()).toEqual(expect.stringContaining("report_id is required"));
          
        }, 10000);


        test("test13 update_vote function, vote up and down, should response with status code 200 and updated vote counts", async () => {
          const reqUp = createRequest();
          const resUp = createResponse();
          reqUp.body = {
            report_id: "1",
            username: "testuser2",
            vote_type: "upvote",
          };
          await FloodReport.update_vote(reqUp, resUp);
          expect(resUp.statusCode).toBe(404);
        
          const reqDown = createRequest();
          const resDown = createResponse();
          reqDown.body = {
            report_id: "",
            username: "",
            vote_type: "downvote",
          };
          await FloodReport.update_vote(reqDown, resDown);
          expect(resDown.statusCode).toBe(400);
          
          }, 10000);
});

function randomMongoID() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};