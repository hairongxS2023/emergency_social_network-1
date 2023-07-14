import Messageprivate from "../../controller/private_message_controller"
import { jest } from '@jest/globals'
import MongooseClass from "../../utils/database.js";
import notification_model from "../../models/notification.js";
import { createRequest, createResponse } from 'node-mocks-http';

const mockIo = {
    emit: jest.fn(),
  };

describe("Testing all functions from Public Message Controller", () => {
    test("broadcast: should get 200 and send private message", async () => {
        const req = createRequest({
            body: {
                sender: "testsender",
                receiver: "testreceiver",
                msg: "testmessage",
                roomID: "testroomID"
            },
        });
        const res = createResponse();
    
        // Mock necessary methods
        MongooseClass.findAllRecords = jest.fn().mockResolvedValue([{ emergency_status: "normal" }]);
        MongooseClass.insertRecord = jest.fn().mockResolvedValue({});
    
        // Mock the io object with an emit function
        const io = { emit: jest.fn() };
    
        // Call the function
        await Messageprivate.broadcast(req, res, io);
    
        // Check if the response status code is 200
        expect(res.statusCode).toBe(200);
    
        // Restore mocked methods
        MongooseClass.findAllRecords.mockRestore();
        MongooseClass.insertRecord.mockRestore();
    });

    test('generateRoomID: should return a sorted concatenated string of user1 and user2', () => {
        const req = createRequest({
          app: {
            get: jest.fn()
              .mockReturnValueOnce('user1')
              .mockReturnValueOnce('user2'),
          },
        });
        const res = createResponse();
    
        const roomID = Messageprivate.generateRoomID(req, res);
        expect(roomID).toBe('user1user2');
      });
    
      test('pushNotification: should update record and return 203 status', async () => {
        const req = createRequest({
          body: { sender: 'testsender', receiver: 'testreceiver' },
        });
        const res = createResponse();
    
        MongooseClass.updateRecord = jest.fn().mockResolvedValue({});
        const io = { emit: jest.fn() };
    
        await Messageprivate.pushNotification(req, res, io);
    
        expect(res.statusCode).toBe(203);
        expect(res._getJSONData()).toEqual({ message: 'success update' });
    
        MongooseClass.updateRecord.mockRestore();
      });
    
      test('displayNotification: should return displayStatus and sender_list', async () => {
        const req = createRequest({ username: 'testuser' });
        const res = createResponse();
    
        MongooseClass.findAllRecords = jest.fn().mockResolvedValue([
          { show_notification: true, sender_list: ['sender1', 'sender2'] },
        ]);
    
        await Messageprivate.displayNotification(req, res);
    
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
          displayStatus: true,
          sender_list: ['sender1', 'sender2'],
        });
    
        MongooseClass.findAllRecords.mockRestore();
      });
    
      test('deleteNotification: should update record and return 200 status', async () => {
        const req = createRequest({ username: 'testuser' });
        const res = createResponse();
    
        MongooseClass.findAndUpdate = jest.fn().mockResolvedValue({});
    
        await Messageprivate.deleteNotification(req, res);
    
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: 'delete successful' });
    
        MongooseClass.findAndUpdate.mockRestore();
      });
});

