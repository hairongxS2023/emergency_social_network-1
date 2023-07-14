import MessagePublic from "../../controller/public_message_controller";
import {createRequest, createResponse}  from 'node-mocks-http';
import {jest} from "@jest/globals";
import MongooseClass from "../../utils/database.js";
import Time from "../../utils/time.js";
Time.get_time = jest.fn(() => new Date());

const mockIo = {
    emit: jest.fn(),
  };


describe("Testing all functions from Public Message Controller", () => {
test("broadcast: should get 200", async () => {
    const req = createRequest();
    const res = createResponse();

    const reqBody = {
        user: "testname",
        msg: "test message",
    };

    req.body = reqBody;

    // Mock Mongoose methods
    MongooseClass.findAllRecords = jest.fn().mockResolvedValue([{ emergency_status: "OK" }]);
    MongooseClass.insertRecord = jest.fn().mockResolvedValue({});

    // Call the function
    await MessagePublic.broadcast(req, res, mockIo);

    // Check if the response status code is 200
    expect(res.statusCode).toBe(200);

    // Restore mocked methods
    MongooseClass.findAllRecords.mockRestore();
    MongooseClass.insertRecord.mockRestore();
});
});