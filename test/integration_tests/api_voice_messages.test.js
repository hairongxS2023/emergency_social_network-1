// process.env.NODE_ENV = 'test';
import axios from 'axios';
import { expect } from 'chai';
import Auth from '../../middleware/auth.js';
import { jest } from '@jest/globals'
import FormData from 'form-data';
import MongooseClass from '../../utils/database.js';
import mockFs from "mock-fs";
// import APP from '../../app.js';
import { response } from 'express';
let jwtToken;
// APP.server.listen(5003);

const api = axios.create({
    baseURL: 'http://localhost:5003',
    headers: { contentType: 'application/json; charset=utf-8' },
    timeout: 10000,
});


describe('success /voice-messages API', () => {
    let testFile;
    let testFilePath;
    let id;
    beforeAll(async () => {
        testFile = Buffer.from("OggS00000000", "utf-8");
        testFilePath = "public/voice-messages/test.ogg";
        mockFs({
        "public/voice-messages": {
            "test.ogg": testFile,
        },
        });
        const payload = { username: 'testname', authority: 'citizen' };
        jwtToken = await Auth.genToken(payload);
    });

    afterAll(() => {
        mockFs.restore();
    });

    beforeEach(async () => {
    });

    
    afterEach(async() => {
        jest.clearAllMocks();
    });

    test('1. GET /voice-messages should save a voice message and return 200 status', async () => {
        try {
            const response = await api.get('/voice-messages', {
                headers: { 'Cookie': `access_token=${jwtToken}`, },
            });
            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('object');
            // Add more assertions based on the expected response data structure
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, 15000);

    test('2. POST /voice-messages should save a voice message and return 200 status', async () => {
        try {
            const form = new FormData();
            form.append("username", "testname");
            form.append("voice-message", testFile, { filename: "test.ogg", contentType: "voice-message.ogg" });

            const response = await api.post("/voice-messages", form, {
                headers: { 
                    'Cookie': `access_token=${jwtToken}`, 
                    ...form.getHeaders(),
                },
                data: "testname",
            });
            id = response.data.id;
            expect(response.status).to.equal(200);
            expect(response.data).to.include({"status": "OK"});
            //expect(response.data).to.include({"status": "OK"});



        }
        catch (error) {
            //console.log(error);
            throw error;
        }
    },15000);

    test('3. DELETE /voice-messages should delete a voice message and return 204 status', async () => {
        console.log("idddddd",id);
        try {
            // Make the request
            const response = await api.delete('/voice-messages', {
                headers: {
                    'Cookie': `access_token=${jwtToken}`,
                },
                data: {
                    id: id,
                },
            });

            expect(response.status).to.equal(204);
            expect(response.statusText).to.equal("No Content");

            
        }
        catch (error) {
            throw error;
        }
    });



});

describe('fail /voice-messages API', () => {
    afterAll(async () => {
        // await APP.server.close();
    });
    test('4. DELETE /voice_message error should return 404 status', async () => {
        try {
            const response = await api.delete('/voice-messages', {
                headers: {
                    'Cookie': `access_token=${jwtToken}`,
                },
                data: {
                    id: 'voice_message_id',
                },
            });
        }
        catch (error) {
            expect(error.response.status).to.equal(404);
        }
    }, 15000);

    test('5. GET /voice-messages error should return 500 status', async () => {
        try {
            const response = await api.get('/voice-messages', {
                headers: { 'Cookie': `access_token=${jwtToken}`, },
            });
            
        }
        catch (error) {
            expect(error.response.status).to.equal(500);
        }
    }, 15000);



    test('6. POST /voice-messages error should return 400 status', async () => {
        try{
            const form = new FormData();
            form.append("username", "testname");
            form.append("voice-message", testFile, { filename: "test.mp3", contentType: "mp3" });

            const response = await api.post("/voice-messages", form, {
                headers: { 
                    'Cookie': `access_token=${jwtToken}`, 
                    ...form.getHeaders(),
                },
                data: "testname",
            });

            expect(response).to.equal(400);
        }
        catch (error) {
        }
    
    });




});
