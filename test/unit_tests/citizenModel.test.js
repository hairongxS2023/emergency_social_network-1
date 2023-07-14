import mongoose from 'mongoose';
import citizen_model from '../../models/citizens.js'; // Replace with the path to your citizenModel file
import MongooseClass from '../../utils/database.js'; // Replace with the path to your MongooseClass file
import Time from '../../utils/time';
import { jest } from '@jest/globals';
// Mock MongooseClass methods
MongooseClass.findAndUpdate = jest.fn();

describe('storeStatus', () => {
  beforeEach(() => {
    MongooseClass.findAndUpdate.mockReset();
  });
  afterAll(() => {
    jest.restoreAllMocks();
    });
    
  test('1. storeStatus should call findAndUpdate with correct parameters', async () => {
    const req = {
      body: {
        citizens: 'username',
        emergencyStatus: 'emergency',
      },
    };
    const res = {}; // Currently, res is not used in storeStatus method
    const timestamp = '2023-05-01T10:00:00Z';
    Time.get_time = jest.fn().mockReturnValue(timestamp);
    MongooseClass.findAndUpdate.mockResolvedValue(null);

    await citizen_model.storeStatus(req, res);

    expect(MongooseClass.findAndUpdate).toHaveBeenNthCalledWith(1, citizen_model, { username: 'username' }, { emergency_status: 'emergency' });
    expect(MongooseClass.findAndUpdate).toHaveBeenNthCalledWith(2, citizen_model, { username: 'username' }, { emergency_status_time: timestamp });
  });

});
