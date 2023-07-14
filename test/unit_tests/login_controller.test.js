import Login from "../../controller/login_controller.js";
import {createRequest , createResponse} from "node-mocks-http";
import MongooseClass from "../../utils/database";
import Encryption from "../../middleware/encrypt.js";
import { jest } from '@jest/globals'
import Auth from "../../middleware/auth.js";
// Mock the required methods
const mockHashedPassword = "$2a$10$hashedpassword";
const mockAuthority = "user";
describe("Login with testname and pwd 1234", ()=>{
  test("verify: should get 200 when correct password", async () => {
    const req = createRequest({
        body: {
            username: "testuser",
            password: "testpassword"
        },
    });
    const res = createResponse();

    // Mock necessary methods
    const hashedPassword = await Encryption.encrypt("testpassword");
    Encryption.checkPassword = jest.fn().mockResolvedValue(true);
    Auth.genToken = jest.fn().mockResolvedValue("mockedToken");

    // Call the function
    await Login.verify(req, res, hashedPassword, "authority");

    // Check if the response status code is 200 and if the token is set
    expect(res.statusCode).toBe(200);

    // Restore mocked methods
    Encryption.checkPassword.mockRestore();
    Auth.genToken.mockRestore();
});

test("verify: should get 400 when wrong password", async () => {
    const req = createRequest({
        body: {
            username: "testuser",
            password: "wrongpassword"
        },
    });
    const res = createResponse();

    // Mock necessary methods
    const hashedPassword = await Encryption.encrypt("testpassword");
    Encryption.checkPassword = jest.fn().mockResolvedValue(false);

    // Call the function
    await Login.verify(req, res, hashedPassword, "authority");

    // Check if the response status code is 400
    expect(res.statusCode).toBe(400);

    // Restore mocked methods
    Encryption.checkPassword.mockRestore();
});

test("online: should get 200 and change online status", async () => {
    const req = createRequest({
        body: {
            username: "testuser"
        },
    });
    const res = createResponse();

    // Mock Mongoose method
    MongooseClass.findAndUpdate = jest.fn().mockResolvedValue({});

    // Call the function
    await Login.online(req, res);

    // Check if the response status code is 200
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({message: "change the online status if the user gets online again."});

    // Restore mocked method
    MongooseClass.findAndUpdate.mockRestore();
});
})
