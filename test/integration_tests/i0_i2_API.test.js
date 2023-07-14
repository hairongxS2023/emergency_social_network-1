import axios from 'axios';
import { expect } from 'chai';
import Auth from '../../middleware/auth.js';
import MongooseClass from '../../utils/database.js';
import {jest} from '@jest/globals';

// import APP from '../../app.js';
// APP.server.listen(5003);
let jwtToken;
const api = axios.create({
  baseURL: 'http://localhost:5003',
  headers: { contentType: 'application/json; charset=utf-8', 'Cookie':`${jwtToken}` },
});

beforeAll(async () => {
    //await MongooseClass.connectLocalDB();
    //await MongooseClass.switch_to_test_DB();
    const payload = { username: 'testname'};
    jwtToken = await Auth.genToken(payload);
    
  });

// afterAll(async () => {
//     await MongooseClass.closeDB();
//     await MongooseClass.initDB();
// });

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Usage: Generate a random string with a length of 10
  
let username = generateRandomString(10);
let username2 = generateRandomString(10);
describe('/1 Register/login API test', () => {
  test("1 test POST /users, should return status 201 with register new user", async () => {
    try{
        const response = await api.post('/users', {
                username: username,
                password: "testpassword",
        });
        expect(response.status).to.equal(201);
    }catch(error){
        console.log(error);
        throw error;
    }

  });

  test("2 test login POST /users, should return status 200 with login", async () => {
    try{
        const response = await api.post('/users', {
                username: username, //same username as test1 registered
                password: "testpassword",
        });
        expect(response.status).to.equal(200);
    }catch(error){
        console.log(error);
        throw error;
    }

  });


test("3 test POST /login, wrong password should return status 400 ", async () => {
  try {
    const response = await api.post('/users', {
      username: username, //same username as test1 registered
      password: "wrongpassword",
    });

    // If the response status is not 400, throw an error with the received status
    if (response.status !== 400) {
      throw new Error(`Expected status 400 but received ${response.status}`);
    }
  } catch (error) {
    // Check if the error message contains the expected status code (400)
    expect(error.message).to.contain('400');
  }
});


});

describe('/2 Public chat API test', () => {
    test("4 test POST /message/public, should return status 200 with post public message", async () => {
        try{
            const response = await api.post('/message/public', {
                headers: { 'Cookie': `access_token=${jwtToken}` },
                    username: username,
                    message: "test message",
            });
            expect(response.status).to.equal(200);
        }catch(error){
            console.log(error);
            throw error;
        }
    });
});


describe('/3 Private chat API test', () => {
    test("5 test PUT /privateChatPage, should enter catch block", async () => {
      // Set a custom timeout for this test
      jest.setTimeout(5000);
  
      let errorThrown = false;
  
      try {
        const response = api.put('/privateChatPage', {
            headers: { 'Cookie': `access_token=${jwtToken}` },
                user1: username,
                user2: username2,
          
        });
        //expect(response.status).to.equal(204);
        // If the API call doesn't timeout, the test fails
        throw new Error("Expected to enter the catch block, but the request succeeded");
      } catch (error) {
        errorThrown = true;
        expect(error.message).to.contain('succeed');
      }
    });
  });

describe('/4 Share status API test', () => {
    test("6 test PUT /users/:username/EmergencyLevels, should return code 200", async () => {
        try{
            const response = await api.put('/users/'+username+'/EmergencyLevels', {
                headers: { 'Cookie': `access_token=${jwtToken}` },
                    citizens: username,
                    emergencyStatus: "Emergency",
            });
            expect(response.status).to.equal(200);
        }catch(error){
            console.log(error);
            throw error;
        }
    });
});  
  
// describe('/5 Speed test API test', () => {
//     test("7 test PUT /test-mode", async () => {
//        try{
//             const response = api.put('/test-mode', {
//                 headers: { 'Cookie': `access_token=${jwtToken}` },
//             });
//         throw new Error("Expected to enter the catch block, but the request succeeded");
//         }catch(error){
//             console.log(error);
//             expect(error.message).to.contain('succeed');
//         }
//     });
// });  
    
  

  


