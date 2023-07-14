import Voice from "../../controller/voice_message_controller.js";
import { createRequest, createResponse } from "node-mocks-http";
import voice_message_model from "../../models/voice_msg.js";
import MongooseClass from "../../utils/database";
//import { createMockDatabase } from '../mock_database.js';
import { jest } from '@jest/globals'
import multer from "multer";
const upload = multer();
import path from "path";
import mockFs from "mock-fs";
import { fileURLToPath } from "url";
import fs from "fs";

describe("Voice message test", () => {
    const mockIo = {
        emit: jest.fn(),
    };
    beforeAll(async () => {
        const p = path.dirname(fileURLToPath(import.meta.url));
        // Mock the filesystem
        mockFs({
            p: {},
        });
    });

    afterAll(async () => {
        // Restore the filesystem
        jest.resetAllMocks();
        mockFs.restore();
    });


    afterEach(() => {
        jest.clearAllMocks();
    });
    test("1. get_all_voice_messages test should get 200", async () => {
        const req = createRequest();
        const res = createResponse();
        MongooseClass.findAllRecords = jest.fn().mockResolvedValue([
            {
              _id: "1",
              sender: "testname",
              timesent: "2021-05-01T00:00:00.000Z",
            },
          ]);
        const max_len = 10;
        Voice.get_all_voice_messages(req, res);
        expect(res.statusCode).toBe(200);
        MongooseClass.findAllRecords.mockRestore();

    }, 15000);

    test("2. broadcast_and_save_voice_message: should get 200", async () => {
        const req = createRequest();
        const res = createResponse();
        const username = "testname";
        const mockFile = {
            fieldname: "voice-message",
            originalname: "voice-message.ogg",
            encoding: "7bit",
            mimetype: "audio/ogg",
            buffer: Buffer.from("mock audio data"),
            size: 1000,
            filename: "testfile.ogg",
        };
    
        const reqBody = {
            username: "testname",
        };
    
        req.body = reqBody;
        req.file = mockFile;
    
        // Mock Mongoose methods
        MongooseClass.findAllRecords = jest.fn().mockResolvedValue([{ emergency_status: "OK" }]);
        MongooseClass.insertRecord = jest.fn().mockResolvedValue({ _id: "mockedId" });
    
        // Mock countMessagesInLastHour method
        Voice.countMessagesInLastHour = jest.fn().mockResolvedValue(0);
    
        // Call the function
        await upload.single("voice-message")(req, res, async (err) => {
            if (err) {
                console.error(err);
            }
            await Voice.broadcast_and_save_voice_message(mockIo, req, res);
            expect(res.statusCode).toBe(200);
        });
    
        // Restore mocked methods
        MongooseClass.findAllRecords.mockRestore();
        MongooseClass.insertRecord.mockRestore();
        Voice.countMessagesInLastHour.mockRestore();
    });



    test('3. delete_voice_message, should return 404 status if voice message not found', async () => {
        const req = createRequest({ body: { id: 'FAKEID' } });
        const res = createResponse();
        MongooseClass.deleteRecord = jest.fn().mockRejectedValue(
            new Error('Failed to save announcement')
          );
        await Voice.delete_voice_message(mockIo, req, res);
        expect(res.statusCode).toBe(404);
    });

    test('4. get_upload, called should be true if upload created success', async () => {
        const req = createRequest();
        const res = createResponse();
        const mockFile = {
            fieldname: "voice-message",
            originalname: "voice-message.ogg",
            encoding: "7bit",
            mimetype: "audio/ogg",
            buffer: Buffer.from("mock audio data"),
            size: 1000,
            filename: "testfile.ogg"
        };
        req.body = {
            username: 'testname'
        };
        req.file = mockFile;
        let called = false;
        const upload = await Voice.get_upload(req, res);
        // Create a spy on the stop_test_DB method of the MongooseClass
        if (upload) {
            called = true;
        }

        // Clean up the spy
        expect(called).toBe(true);
    }
    );

    test('5. save_voice_message success, should save voice message and return 200', async () => {
        const req = createRequest();
        const res = createResponse();
        const mockFile = {
            fieldname: "voice-message",
            originalname: "voice-message.ogg",
            encoding: "7bit",
            mimetype: "audio/ogg",
            buffer: Buffer.from("mock audio data"),
            size: 1000,
            filename: "testfile.ogg"
        };
        req.body = {
            username: 'testname'
        };
        req.file = mockFile;

        // Mock Mongoose methods
        const mockFindAllRecords = jest.spyOn(MongooseClass, 'findAllRecords');
        mockFindAllRecords.mockResolvedValue([ { username: 'testname', emergency_status: 'normal' } ]);

        const mockInsertRecord = jest.spyOn(MongooseClass, 'insertRecord');
        mockInsertRecord.mockResolvedValue({ _id: 'mockedId' });

        // Mock fs.unlinkSync
        const unlinkSyncSpy = jest.spyOn(fs, 'unlinkSync');
        unlinkSyncSpy.mockImplementation(() => { });

        // Run the method
        await Voice.save_voice_message(req, res);

        // Clean up the spies
        mockFindAllRecords.mockRestore();
        mockInsertRecord.mockRestore();
        unlinkSyncSpy.mockRestore();

        // Check if the response status is 200
        expect(res.statusCode).toBe(200);
    });



    test("6. delete_voice_message: should get 204", async () => {
        const req = createRequest();
        const res = createResponse();
    
        const reqBody = {
            id: "mockedId",
        };
    
        req.body = reqBody;
    
        // Mock Mongoose methods
        MongooseClass.deleteRecord = jest.fn().mockResolvedValue({});
    
        // Call the function
        await Voice.delete_voice_message(mockIo, req, res);
    
        // Check if the response status code is 204
        expect(res.statusCode).toBe(204);
    
        // Restore mocked methods
        MongooseClass.deleteRecord.mockRestore();
    });

    test("7. broadcast_and_save_voice_message 6 times, should get 429", async () => {
        const req = createRequest();
        const res = createResponse();
        const username = "testname";
        const mockFile = {
            fieldname: "voice-message",
            originalname: "voice-message.ogg",
            encoding: "7bit",
            mimetype: "audio/ogg",
            buffer: Buffer.from("mock audio data"),
            size: 1000,
            filename: "testfile.ogg"
        };

        req.body = {
            username: 'testname'
        };
        req.file = mockFile;

        // Mock the #countMessagesInLastHour method to always return 5
        const countMessagesInLastHourMock = jest.spyOn(Voice, 'countMessagesInLastHour');
        countMessagesInLastHourMock.mockResolvedValue(6);

        // Now your req.file should be set correctly
        await Voice.broadcast_and_save_voice_message(mockIo, req, res);
        expect(res.statusCode).toBe(429);
        // Clean up the mock
        countMessagesInLastHourMock.mockRestore();
    }, 15000);

    test('8. should return a properly configured multer instance', () => {
        const upload = Voice.get_upload();

        // Check if storage destination is correct
        expect(upload.storage.getFilename).toBeDefined();

        // Check if the file size limit is correct
        expect(upload.limits.fileSize).toBe(1000000);

        // Check if the fileFilter is defined
        expect(upload.fileFilter).toBeDefined();
    });

    test('9. should correctly filter .ogg files', () => {
        const upload = Voice.get_upload();
        const mockReq = { body: { username: 'testuser' } };
        const allowedFile = { originalname: 'testfile.ogg' };
        const disallowedFile = { originalname: 'testfile.mp3' };

        upload.fileFilter(mockReq, allowedFile, (error, result) => {
            expect(error).toBeNull();
            expect(result).toBeTruthy();
        });

        upload.fileFilter(mockReq, disallowedFile, (error, result) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Only .ogg files are allowed');
        });
    });

    test('10. broadcast_and_save_voice_message, should save and broadcast the voice message and return 200', async () => {
        const req = createRequest();
        const res = createResponse();
        const mockFile = {
            fieldname: "voice-message",
            originalname: "voice-message.ogg",
            encoding: "7bit",
            mimetype: "audio/ogg",
            buffer: Buffer.from("mock audio data"),
            size: 1000,
            filename: "testfile.ogg"
        };
        req.body = {
            username: 'testname'
        };
        req.file = mockFile;

        const mockIo = {
            emit: jest.fn(),
        };

        // Mock countMessagesInLastHour method
        const countMessagesInLastHourSpy = jest.spyOn(Voice, 'countMessagesInLastHour');
        countMessagesInLastHourSpy.mockResolvedValue(2);

        // Mock save_voice_message method
        const saveVoiceMessageSpy = jest.spyOn(Voice, 'save_voice_message');
        saveVoiceMessageSpy.mockImplementation(() => { });

        // Run the method
        await Voice.broadcast_and_save_voice_message(mockIo, req, res);

        // Clean up the spies
        countMessagesInLastHourSpy.mockRestore();
        saveVoiceMessageSpy.mockRestore();

        // Check if the response status is 200
        expect(res.statusCode).toBe(200);
        // Check if the io.emit was called
        expect(mockIo.emit).toHaveBeenCalledTimes(2);
    });

    test("11. Save voice message catch block fail, should receive 500", async () => {
        const req = createRequest();
        const res = createResponse();
        const username = "testname";
        const mockFile = {
            fieldname: "voice-message",
            originalname: "voice-message.ogg",
            encoding: "7bit",
            mimetype: "audio/ogg",
            buffer: Buffer.from("mock audio data"),
            size: 1000,
            filename: "testfile.ogg"
        };

        req.body = {
            username: 'testname'
        };
        req.file = mockFile;

        // Mock the MongooseClass.findAllRecords method to return a user with emergency_status
        MongooseClass.findAllRecords = jest.fn().mockResolvedValue([ { emergency_status: "normal" } ]);

        // Mock the MongooseClass.insertRecord method to throw an error
        MongooseClass.insertRecord = jest.fn().mockImplementation(() => {
            throw new Error("Failed to save voice message");
        });

        // Mock countMessagesInLastHour to return a valid count
        Voice.countMessagesInLastHour = jest.fn().mockResolvedValue(0);

        // Spy on console.error to check if it's called
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        await Voice.broadcast_and_save_voice_message(null, req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getData()).toEqual("{\"error\":\"Failed to save voice message\"}");
        expect(consoleErrorSpy).toHaveBeenCalled();

        // Clean up the mocks
        MongooseClass.findAllRecords.mockRestore();
        MongooseClass.insertRecord.mockRestore();
        Voice.countMessagesInLastHour.mockRestore();
        consoleErrorSpy.mockRestore();
    });


    test("12. Get all voice messages catch block, should get 500", async () => {
        const req = createRequest();
        const res = createResponse();

        // Mock the MongooseClass.findAllRecords method to throw an error
        MongooseClass.findAllRecords = jest.fn().mockRejectedValue(() => {
            throw new Error("Error fetching voice messages");
        });

        await Voice.get_all_voice_messages(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getData()).toEqual("{\"status\":\"Error\"}");

        // Clean up the mocks
        MongooseClass.findAllRecords.mockRestore();
    });
    test("13. when missing required fields (username) should return 400 with a Bad Request status ", async () => {
        const req = createRequest({ body: { /* Missing username */ }, file: { filename: 'test.ogg' } });
        const res = createResponse();

        await Voice.broadcast_and_save_voice_message({}, req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: "Bad Request",
            message: "Missing required fields",
        });
    });

    test("14. when missing file should return 400 with a Bad Request status ", async () => {
        const req = createRequest({ body: { username: 'testuser' } /* Missing file */ });
        const res = createResponse();

        await Voice.broadcast_and_save_voice_message({}, req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: "Bad Request",
            message: "Missing file",
        });
    });

    test("15. when missing required fields (id), should return 400 with a Bad Request status ", async () => {
        const req = createRequest({ body: { /* Missing id */ } });
        const res = createResponse();

        await Voice.delete_voice_message({}, req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: "Bad Request",
            message: "Missing required fields",
        });
    });
    test("16. when missing username should return 400 with a Bad Request status ", async () => {
        const req = createRequest({ body: { /* Missing username */ }});
        const res = createResponse();

        await Voice.save_voice_message( req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: "Bad Request",
            message: "Missing required fields",
        });
    });
    test("17. when missing username should return 400 with a Bad Request status ", async () => {
        const req = createRequest({ body: { username: 'testuser' } });
        const res = createResponse();

        await Voice.save_voice_message( req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: "Bad Request",
            message: "Missing file",
        });
    });
    test('18. it should generate a valid filename for a voice message', () => {
        const req = createRequest({ body: { username: 'testuser' } });
        const file = { originalname: 'test.ogg' };

        Voice.generateFileName(req, file, (error, filename) => {
            expect(error).toBeNull();

            const [username, timestamp] = filename.split('-');
            const extension = filename.split('.').pop();

            expect(username).toBe('testuser');
            expect(parseInt(timestamp)).not.toBeNaN();
            expect(extension).toBe('ogg');
        });
    });

    test("19 should call fs.readFileSync with the correct file path if req.file.buffer is not available", async () => {
        const mockVoiceData = Buffer.from("mock voice data");
        // fs.readFileSync = jest.fn().mockResolvedValue({mockVoiceData});
        // fs.readFileSync = jest.fn().mockReturnValue(mockVoiceData);

        fs.unlinkSync = jest.fn().mockImplementation(() => {});

        const req = createRequest({
          body: { username: "testuser" },
          file: {
            filename: "testname-1681256698474.ogg",
            originalname: "test.ogg",
          },
        });
        const res = createResponse();
        MongooseClass.findAllRecords = jest.fn().mockResolvedValue([{ emergency_status: 'OK' }]);
        MongooseClass.insertRecord = jest.fn().mockResolvedValue({ _id: '12345' });
        try{
            await Voice.save_voice_message(req, res);
            const expectedFilePath = path.join(
                path.dirname(fileURLToPath(import.meta.url)),
                "../public/voice-messages",
                req.file.filename
              );
            expect(fs.readFileSync).toHaveBeenCalledWith(expectedFilePath);

        }
        catch(err){
            console.log(err);
        }
        fs.unlinkSync.mockRestore();
        MongooseClass.findAllRecords.mockRestore();
        MongooseClass.insertRecord.mockRestore();

      });
      test('20 Should call fs.unlinkSync with the correct file path', () => {
        // Mock fs.unlinkSync
        fs.unlinkSync = jest.fn().mockImplementation(() => {});;

        // Sample file path
        const filePath = '/path/to/sample/file.txt';

        // Call the function
        Voice.delete_local_file(filePath);

        // Verify fs.unlinkSync is called with the correct file path
        expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
      });

});





