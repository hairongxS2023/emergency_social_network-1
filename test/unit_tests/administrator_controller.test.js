import MongooseClass from "../../utils/database.js"
import { createRequest, createResponse } from 'node-mocks-http';
import { jest } from '@jest/globals'
import administrator_controller from "../../controller/administrator_controller.js";
import citizen_model from "../../models/citizens.js";
import path from "path";
import mockFs from "mock-fs";
import { fileURLToPath } from "url";
import fs from "fs";

describe("load history announcement", () => {
    const mockIo = {
        emit: jest.fn(),
      };
      beforeAll(async () => {
        const p = path.dirname(fileURLToPath(import.meta.url));
        // Mock the filesystem
        mockFs({
            p: {},
        });
        // await MongooseClass.connectTestDB();
      });
      afterAll(async () => {
        jest.resetAllMocks();
        mockFs.restore();
        // await MongooseClass.delete_voice_DB();
      });
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("1. adduserprofiles it should return 200 with json format of database result", async () => {
        MongooseClass.findAllRecords = jest.fn().mockResolvedValue([
          {
            _id: "1",
            username: "testname 1",
            password: "test pass",
            account_status: "active",
            privilege: "administator",
            emergency_status: "OK",
          },
          {
            _id: "2",
            username: "testname 2",
            password: "test pass",
            account_status: "active",
            privilege: "administator",
            emergency_status: "OK",
          },
        ]);
        const req = createRequest();
        const res = createResponse();
        await administrator_controller.allUserProfiles(req, res);
    
        // Expect the status code to be 200
        expect(res.statusCode).toBe(200);
    
        // Expect the response JSON to match the mocked announcements
        expect(res._getJSONData()).toEqual(
            [
            {
                _id: "1",
                username: "testname 1",
                password: "test pass",
                account_status: "active",
                privilege: "administator",
                emergency_status: "OK",
              },
              {
                _id: "2",
                username: "testname 2",
                password: "test pass",
                account_status: "active",
                privilege: "administator",
                emergency_status: "OK",
              },
            ]
        );
    
      });

      test("2. searchUserProfile it should return 200 with json format of database result", async () => {
        citizen_model.find = jest.fn().mockResolvedValue([
          {
            _id: "1",
            username: "testname 1",
            password: "test pass",
            account_status: "active",
            privilege: "administator",
            emergency_status: "OK",
          }
        ]
        );
        const req = createRequest();
        const res = createResponse();
        await administrator_controller.searchUserProfile(req, res);
    
        // Expect the status code to be 200
        expect(res.statusCode).toBe(200);
    
        // Expect the response JSON to match the mocked announcements
        expect(res._getJSONData()).toEqual(
            
            {
                _id: "1",
                username: "testname 1",
                password: "test pass",
                account_status: "active",
                privilege: "administator",
                emergency_status: "OK",
              }
            
        );
    
      });

      test("3. updatePrivilegeLevel it should return 200 with json format of database result", async () => {
        citizen_model.find = jest.fn().mockResolvedValue(
          {
            _id: "1",
            username: "testname 1",
            password: "test pass",
            account_status: "active",
            privilege: "administator",
            emergency_status: "OK",
          }
        );

        // MongooseClass.findAndUpdate = jest.fn().mockResolvedValue(
        //   {
        //     _id: "1",



        //   });
        const req = createRequest();
        const res = createResponse();
        await administrator_controller.updatePrivilegeLevel(req, res);
    
        // Expect the status code to be 200
        expect(res.statusCode).toBe(200);
    
        // Expect the response JSON to match the mocked announcements
        
    
      });

      test("4. updatePrivilegeLevel it should return 200 with json format of database result", async () => {
        citizen_model.find = jest.fn().mockResolvedValue(
          {
            _id: "1",
            username: "testname 1",
            password: "test pass",
            account_status: "active",
            privilege: "administator",
            emergency_status: "OK",
          }
        );

        // MongooseClass.findAndUpdate = jest.fn().mockResolvedValue(
        //   {
        //     _id: "1",



        //   });
        const req = createRequest();
        const res = createResponse();
        await administrator_controller.updateAccountStatus(req, res);
    
        // Expect the status code to be 200
        expect(res.statusCode).toBe(200);
    
        // Expect the response JSON to match the mocked announcements
        
    
      });




});
