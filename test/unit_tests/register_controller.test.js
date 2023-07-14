import Register from "../../controller/register_controller";
import {createRequest , createResponse} from "node-mocks-http";
import MongooseClass from "../../utils/database";
import citizen_model from "../../models/citizens";
import Encryption from "../../middleware/encrypt.js";
import { jest } from '@jest/globals'
import Auth from "../../middleware/auth.js";
import Login from "../../controller/login_controller.js";
function random_string(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result; 
}

describe('register()', () => {
  beforeAll(() => {
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
  });

  test('1. register should create a new user if the username does not exist', async () => {
    MongooseClass.findAllRecords=jest.fn().mockResolvedValue([]);
    MongooseClass.insertRecord=jest.fn().mockResolvedValue({});
    Auth.genToken=jest.fn().mockResolvedValue('fake_token');
    const req = createRequest({
      body: {
        username: 'newuser',
        password: 'password',
      },
    });
    const res = createResponse();

    await Register.register(req, res);
    //expect timeout

    expect(res.statusCode).toBe(201);
    // expect(res._getJSONData()).toEqual({ message: { statusCode: 201, message: 'Create Success' } });
  });

  // test('2. register should call Login.verify when a user with the same username already exists', async () => {
  //   MongooseClass.findAllRecords.mockResolvedValue([{ username: 'existinguser', password: 'hashedpassword' }]);
  //   const req = createRequest({
  //     body: {
  //       username: 'existinguser',
  //       password: 'password',
  //     },
  //   });
  //   const res = createResponse();
  //   const mockLoginVerify = jest.spyOn(Login, 'verify');
  //   mockLoginVerify.mockImplementation(() => {});
  //   await Register.register(req, res);

  //   expect(MongooseClass.findAllRecords).toHaveBeenCalledWith(citizen_model, { username: 'existinguser' });
  //   expect(Login.verify).toHaveBeenCalledWith('existinguser', 'password', 'hashedpassword');
  // });
  test('2. register should call Login.verify if the user already exists', async () => {
    const req = {
      body: {
        username: 'existingUser',
        password: 'password123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    const existingUser = [
      {
        username: 'existingUser',
        password: 'hashedPassword123',
      },
    ];

    const findAllRecordsSpy = jest.spyOn(MongooseClass, 'findAllRecords').mockResolvedValue(existingUser);
    const verifySpy = jest.spyOn(Login, 'verify').mockImplementation(() => {});

    await Register.register(req, res);

    expect(MongooseClass.findAllRecords).toHaveBeenCalledWith(citizen_model, { username: 'existingUser' });
    //expect(Login.verify).toHaveBeenCalledWith('existinguser', 'password', 'hashedpassword');
    findAllRecordsSpy.mockRestore();
    verifySpy.mockRestore();
  });

  test('3. register should return a 500 error if there is an error in the catch block', async () => {
    MongooseClass.findAllRecords.mockRejectedValue(new Error('Find Error'));
    const req = createRequest({
      body: {
        username: 'testuser',
        password: 'password',
      },
    });
    const res = createResponse();

    await Register.register(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal Server Error' });
  });

  test('4. register should return an error if validation fails', async () => {
    const req = createRequest({
      body: {
        username: 'bad',
        password: 'pass',
      },
    });
    const res = createResponse();

    Register.username_password_validation = jest.fn().mockReturnValue({ statusCode: 400, message: 'Validation Failed' });
    Register.create_user = jest.fn().mockResolvedValue({});

    await Register.register(req, res);

    expect(Register.username_password_validation).toHaveBeenCalledWith('bad', 'pass');
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual('Validation Failed');

    Register.username_password_validation.mockRestore();
  });

  test('5. register should not create a new user if the username/password not valid', async () => {
    MongooseClass.findAllRecords = jest.fn().mockResolvedValue([]);
    MongooseClass.insertRecord = jest.fn().mockResolvedValue({});
    Register.username_password_validation = jest.fn().mockReturnValue({ statusCode: 400, message: 'Validation Failed' });
  
    const req = createRequest({
      body: {
        username: 'a',
        password: 'bccdsda',
      },
    });
    const res = createResponse();
  
    await Register.register(req, res);
  
    expect(res.statusCode).toBe(400);
    MongooseClass.findAllRecords.mockRestore();
    MongooseClass.insertRecord.mockRestore();
  });

  test('6. register should not create a new user if the username/password not valid', async () => {
    MongooseClass.findAllRecords = jest.fn().mockResolvedValue([]);
    MongooseClass.insertRecord = jest.fn().mockResolvedValue({});
  
    const req = createRequest({
      body: {
        username: 'abcdefg',
        password: 'bc',
      },
    });
    const res = createResponse();
  
    await Register.register(req, res);
  
    expect(res.statusCode).toBe(400);
    MongooseClass.findAllRecords.mockRestore();
    MongooseClass.insertRecord.mockRestore();
  });

  test('7. register should return 400 if no valid username/password', async () => {
    MongooseClass.findAllRecords = jest.fn().mockResolvedValue([]);
    MongooseClass.insertRecord = jest.fn().mockResolvedValue({});
  
    const req = createRequest({
      body: {
        username: '',
        password: 'bc',
      },
    });
    const res = createResponse();
  
    await Register.register(req, res);
  
    expect(res.statusCode).toBe(400);
    MongooseClass.findAllRecords.mockRestore();
    MongooseClass.insertRecord.mockRestore();
  });

  test('8. create_user should return an error response if insertRecord throws an error', async () => {
    const req = createRequest({
      body: {
        username: 'newUser',
        password: 'password123',
      },
    });

    const res = createResponse();

    const insertRecordSpy = jest.spyOn(MongooseClass, 'insertRecord').mockRejectedValue(new Error('Find Error'));
    const response = await Register.create_user(req, res);

    expect(response).toEqual({});
    insertRecordSpy.mockRestore();
  });
});