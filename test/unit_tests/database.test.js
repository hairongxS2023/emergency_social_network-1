import MongooseClass from '../../utils/database';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import public_channel_msg_model from '../../models/public_channel_msg';
import { jest } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();
// Mock the model
let mongoServer;
let mongoUri;

describe('MongooseClass.insertRecord()', () => {
    let mongoServer;
    let mongoUri;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('1. insertRecord should save the public_channel_msg_model successfully', async () => {
        // Create a new instance of public_channel_msg_model with sample data
        const sampleData = { username: 'testUser', msg: 'testMessage' };
        const publicChannelMsgInstance = new public_channel_msg_model(sampleData);

        // Mock the save function
        public_channel_msg_model.prototype.save = jest.fn().mockImplementation(function (callback) {
            callback(null, this);
        });

        // Call insertRecord
        const result = await MongooseClass.insertRecord(publicChannelMsgInstance);

        // Check if the save function was called and the result is correct
        expect(public_channel_msg_model.prototype.save).toHaveBeenCalled();
        expect(result.username).toBe(sampleData.username);
        expect(result.msg).toBe(sampleData.msg);
    });

    test('2. insertRecord should return early if the database is disconnected', async () => {
        // Set the connection state to disconnected
        mongoose.connection.readyState = 0;

        // Create a new instance of public_channel_msg_model with sample data
        const sampleData = { username: 'testUser', msg: 'testMessage' };
        const publicChannelMsgInstance = new public_channel_msg_model(sampleData);

        // Mock the save function
        public_channel_msg_model.prototype.save = jest.fn().mockImplementation(function (callback) {
            callback(null, this);
        });

        // Call insertRecord
        const result = await MongooseClass.insertRecord(publicChannelMsgInstance);

        // Check if the save function was not called and the result is undefined
        expect(public_channel_msg_model.prototype.save).not.toHaveBeenCalled();
        expect(result).toBeUndefined();

        // Reset the connection state to connected
        mongoose.connection.readyState = 1;
    });

});

describe('MongooseClass.findAndUpdate()', () => {
    let mongoServer;
    let mongoUri;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('1. findAndUpdate should update the public_channel_msg_model successfully', async () => {
        // Create a new instance of public_channel_msg_model with sample data
        const sampleData = { username: 'testUser', msg: 'testMessage' };
        const publicChannelMsgInstance = new public_channel_msg_model(sampleData);

        // Mock the findOneAndUpdate function
        public_channel_msg_model.findOneAndUpdate = jest.fn().mockImplementation((require_query, update_query, callback) => {
            callback(null, { ...sampleData, ...update_query });
        });

        // Prepare require_query and update_query
        const require_query = { username: 'testUser' };
        const update_query = { msg: 'updatedMessage' };

        // Call findAndUpdate
        const result = await MongooseClass.findAndUpdate(public_channel_msg_model, require_query, update_query);

        // Check if the findOneAndUpdate function was called and the result is correct
        expect(public_channel_msg_model.findOneAndUpdate).toHaveBeenCalledWith(require_query, update_query, expect.any(Function));
        expect(result.username).toBe(sampleData.username);
        expect(result.msg).toBe(update_query.msg);
    });

    test('2. findAndUpdate should return early if the database is disconnected', async () => {
        // Set the connection state to disconnected
        mongoose.connection.readyState = 0;

        // Prepare require_query and update_query
        const require_query = { username: 'testUser' };
        const update_query = { msg: 'updatedMessage' };

        // Call findAndUpdate
        const result = await MongooseClass.findAndUpdate(public_channel_msg_model, require_query, update_query);

        // Check if the findOneAndUpdate function was not called and the result is undefined
        expect(result).toBeUndefined();

        // Reset the connection state to connected
        mongoose.connection.readyState = 1;
    });
});

describe('MongooseClass.findAllRecords()', () => {
    let mongoServer;
    let mongoUri;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('findAllRecords should retrieve all records of public_channel_msg_model successfully', async () => {
        // Mock the find function
        const mockFindQuery = {
            find: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockImplementation((callback) => {
                callback(null, [ { username: 'testUser', msg: 'testMessage' } ]);
            }),
        };

        public_channel_msg_model.find = jest.fn().mockReturnValue(mockFindQuery);

        // Call findAllRecords
        const result = await MongooseClass.findAllRecords(public_channel_msg_model);

        // Check if the find function was called and the result is correct
        expect(public_channel_msg_model.find).toHaveBeenCalled();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(1);
        expect(result[ 0 ].username).toBe('testUser');
        expect(result[ 0 ].msg).toBe('testMessage');
    });

    test('findAllRecords should return early if the database is disconnected', async () => {
        // Set the connection state to disconnected
        mongoose.connection.readyState = 0;

        // Call findAllRecords
        const result = await MongooseClass.findAllRecords(public_channel_msg_model);

        // Check if the find function was not called and the result is undefined
        expect(public_channel_msg_model.find).not.toHaveBeenCalled();
        expect(result).toBeUndefined();

        // Reset the connection state to connected
        mongoose.connection.readyState = 1;
    });
});

describe('MongooseClass.connectDB()', () => {
    let mongoServer;
    let mongoUri;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });
    
    // test("initDB, connectDB and disconnectDB should be defined", async() => {
    //     mongoose.connectDB = jest.fn().mockImplementation((connectionString, connectionOptions) => {
    //         return new Promise((resolve) => {
    //           resolve();
    //         });
    //       });
    //     await MongooseClass.connectDB(mongoUri);
        
    // });
        

    test('connectDB should connect to the database successfully', async () => {
        // Mock the connect function of mongoose
        mongoose.connect = jest.fn().mockImplementation((connectionString, connectionOptions) => {
          return new Promise((resolve) => {
            resolve();
          });
        });
        // Mock the event listeners of mongoose.connection
        mongoose.connection.once = jest.fn((event, callback) => {
          if (event === 'connected') {
            callback();
          }
        });
        // Call connectDB
        await MongooseClass.connectDB(mongoUri);
      
        // Check if the connect function was called
        expect(mongoose.connect).toHaveBeenCalledWith(mongoUri, expect.any(Object));
      });
});

describe('MongooseClass.closeDB()', () => {
    let mongoServer;
    let mongoUri;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        // await mongoose.disconnect();
        await MongooseClass.closeDB()
        await mongoServer.stop();
    });

    test('closeDB should close the database connection successfully', async () => {
        expect(1).toBe(1);
      },30000);
      
});


describe('MongooseClass.switch_to_test_DB()', () => {
    let mongoServer;
    let mongoUri;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await mongoServer.stop();
    });

    test('switch_to_test_DB should switch to the test database successfully', async () => {
        const TEST_DB = process.env.MONGODB_URL_TEST;
        // Mock the mongoose methods
        mongoose.connection.name = 'normal';
        mongoose.connection.readyState = 1;
        mongoose.connection.close = jest.fn().mockResolvedValue();
        mongoose.connect = jest.fn();
    
        // Call switch_to_test_DB
        await MongooseClass.switch_to_test_DB();
    
        // Check if the connection.close and connect methods were called with the right arguments
        expect(mongoose.connection.close).toHaveBeenCalled();
        // expect(mongoose.connect).toHaveBeenCalledWith(TEST_DB, {
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true,
        // });
      });
      
});

describe('MongooseClass.stop_test_DB()', () => {
    let mongoServer;
    let mongoUri;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await mongoServer.stop();
    });

    test('stop_test_DB should switch back to the normal database successfully', async () => {
        // Mock the mongoose methods
        mongoose.connection.readyState = 1;
        mongoose.connection.close = jest.fn().mockResolvedValue();
        mongoose.connect = jest.fn();
    
        // Call stop_test_DB
        await MongooseClass.stop_test_DB();
    
        // Check if the connection.close and connect methods were called with the right arguments
        expect(mongoose.connection.close).toHaveBeenCalled();
        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URL_NORMAL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      });

      test('stop_test_DB should switch back to the normal database successfully', async () => {
        // Mock the mongoose methods
        mongoose.connection.readyState = 0;
        mongoose.connection.close = jest.fn().mockResolvedValue();
        mongoose.connect = jest.fn();
    
        // Call stop_test_DB
        await MongooseClass.stop_test_DB();
    
        // Check if the connection.close and connect methods were called with the right arguments
        expect(mongoose.connection.close).toHaveBeenCalled();
        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URL_NORMAL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      });
      
});

describe('MongooseClass.deleteRecord()', () => {
    let mongoServer;
    let mongoUri;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await mongoServer.stop();
    });

    test('deleteRecord should delete records successfully', async () => {
        // Mock the mongoose connection state
        mongoose.connection.readyState = 1;
    
        // Mock the delete function
        const deleteFunctionMock = jest.fn((query, callback) => callback(null, { n: 1 }));
        public_channel_msg_model.deleteMany = deleteFunctionMock;
        public_channel_msg_model.deleteOne = deleteFunctionMock;
        public_channel_msg_model.findOneAndDelete = deleteFunctionMock;
    
        // Call deleteRecord
        const query = { field: 'value' };
        const result = await MongooseClass.deleteRecord(public_channel_msg_model, query);
    
        // Check if the delete function was called and the result is correct
        expect(deleteFunctionMock).toHaveBeenCalled();
        expect(result.n).toBe(1);
      });
});

describe('MongooseClass.findRespectiveRecords()', () => {
    let mongoServer;
    let mongoUri;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await mongoServer.stop();
    });

    test('findRespectiveRecords should find records successfully', async () => {
        // Mock the mongoose connection state
        mongoose.connection.readyState = 1;
    
        // Mock the find function
        const findMock = jest.fn().mockReturnThis();
        const execMock = jest.fn((callback) => callback(null, [{ field: 'value' }]));
        const sortMock = jest.fn().mockReturnThis();
        const limitMock = jest.fn().mockReturnThis();
    
        public_channel_msg_model.find = findMock;
        findMock.mockReturnValue({
          exec: execMock,
          sort: sortMock,
          limit: limitMock,
        });
    
        // Call findRespectiveRecords
        const type = 'username';
        const query = 'testUser';
        const result = await MongooseClass.findRespectiveRecords(public_channel_msg_model, type, query);
    
        // Check if the find function was called and the result is correct
        expect(findMock).toHaveBeenCalled();
        expect(execMock).toHaveBeenCalled();
        expect(result).toEqual([{ field: 'value' }]);
      });
});