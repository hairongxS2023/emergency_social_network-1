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

    test('1. GET /user-profiles should save a citizen and return 200 status', async () => {
        try {
            const response = await api.get('/user-profiles', {
                headers: { 'Cookie': `access_token=${jwtToken}`, },
            });
            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('array');
            // Add more assertions based on the expected response data structure
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, 15000);

    test('2. GET /user-profiles/:username should save a citizen and return 200 status', async () => {
        try {
            let testname = 'testing1';
            const response = await api.get(`/user-profiles/${testname}`, {
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

    test('3. PUT /user-profiles/account-statuses should save a citizen and return 200 status', async () => {
        try {
            let testname = 'testing1';
            const requestBody = {
                username: testname,
                username_t:"esnadmin"
              };
            const response = await api.get(`/user-profiles/account-statuses`,requestBody, {
                headers: { 'Cookie': `access_token=${jwtToken}` },
            });
            expect(response.status).to.equal(200);
            //expect(response.data).to.be.an('object');
            // Add more assertions based on the expected response data structure
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, 15000);

    test('4. PUT /user-profiles/privilege-levels should save a citizen and return 200 status', async () => {
        try {
            let testname = 'testing1';
            const requestBody = {
                username: testname,
                username_t:"esnadmin"
              };
            const response = await api.get(`/user-profiles/privilege-levels`,requestBody, {
                headers: { 'Cookie': `access_token=${jwtToken}` },
            });
            expect(response.status).to.equal(200);
            //expect(response.data).to.be.an('object');
            // Add more assertions based on the expected response data structure
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, 15000);



});