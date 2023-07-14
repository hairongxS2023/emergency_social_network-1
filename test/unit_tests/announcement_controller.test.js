import Announcement from "../../controller/announcement_controller";
import MongooseClass from "../../utils/database.js"
import {createRequest, createResponse}  from 'node-mocks-http';
import announcement_model from "../../models/announcement.js";
import { jest } from '@jest/globals'


describe("announcement", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('1. loadAnnouncement should return a 200 status and the announcements data', async () => {
    const req = createRequest();
    const res = createResponse();

    const mockData = [{ id: 1, announcement_content: 'Test announcement' }];
    MongooseClass.findAllRecords = jest.fn().mockResolvedValue(mockData);

    await Announcement.loadAnnouncement(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ data: mockData });
  });

  test('2. loadAnnouncement should return a 404 status if an error occurs', async () => {
    const req = createRequest();
    const res = createResponse();

    MongooseClass.findAllRecords = jest.fn().mockRejectedValue(new Error('Not Found'));

    await Announcement.loadAnnouncement(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'Not Found' });
  });
  test('3. postAnnouncement should return a 400 status if username or announcement_content is not provided', async () => {
    const req = createRequest({
      body: {
        username: '',
        announcement_content: '',
      },
    });
    const res = createResponse();

    await Announcement.postAnnouncement(null, req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Bad request for posting new announcement' });
  });

  // test('4. postAnnouncement should return a 403 status if user has no authority to post', async () => {
  //   const req = createRequest({
  //     body: {
  //       username: 'regularUser',
  //       announcement_content: 'Test announcement',
  //     },
  //   });
  //   const res = createResponse();

  //   const mockUser = [{ authority: 'citizen' }];
  //   MongooseClass.findAllRecords = jest.fn().mockResolvedValue(mockUser);

  //   await Announcement.postAnnouncement(null, req, res);

  //   expect(res.statusCode).toBe(403);
  //   expect(res._getJSONData()).toEqual({ message: 'You are not allowed to post new announcement' });
  // });

  test('5. postAnnouncement should return a 201 status and a success message when an authorized user posts an announcement', async () => {
    const req = createRequest({
      body: {
        username: 'adminUser',
        announcement_content: 'Test announcement',
      },
    });
    const res = createResponse();

    const mockUser = [{ authority: 'administrator' }];
    MongooseClass.findAllRecords = jest.fn().mockResolvedValue(mockUser);
    announcement_model.prototype.save = jest.fn().mockResolvedValue({});

    await Announcement.postAnnouncement(null, req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });
});

