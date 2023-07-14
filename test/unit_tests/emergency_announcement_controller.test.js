import EmergencyAnnouncement from "../../controller/emergency_event_controller.js";
import MongooseClass from "../../utils/database.js"
import { createRequest, createResponse } from 'node-mocks-http';
import { jest } from '@jest/globals'



describe("load history announcement", () => {
  const mockIo = {
    emit: jest.fn(),
  };
  beforeAll(async () => {
    // await MongooseClass.connectTestDB();
  });
  afterAll(async () => {
    // await MongooseClass.delete_voice_DB();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("1. it should return 200 with json format of database result", async () => {
    MongooseClass.findAllRecords = jest.fn().mockResolvedValue([
      {
        _id: "1",
        title: "Announcement 1",
        message: "This is announcement 1",
      },
      {
        _id: "2",
        title: "Announcement 2",
        message: "This is announcement 2",
      },
    ]);
    const req = createRequest();
    const res = createResponse();
    await EmergencyAnnouncement.get_all_announcements(req, res);

    // Expect the status code to be 200
    expect(res.statusCode).toBe(200);

    // Expect the response JSON to match the mocked announcements
    expect(res._getJSONData()).toEqual({
      data: [
        {
          _id: "1",
          title: "Announcement 1",
          message: "This is announcement 1",
        },
        {
          _id: "2",
          title: "Announcement 2",
          message: "This is announcement 2",
        },
      ],
    });

  });

  test("2. should return 404 when findAllRecords throws an error", async () => {
    // Mock the MongooseClass.findAllRecords method to throw an error
    MongooseClass.findAllRecords = jest.fn().mockImplementation(() => {
      throw new Error("Not Found");
    });

    const req = createRequest();
    const res = createResponse();

    // Call the function
    await EmergencyAnnouncement.get_all_announcements(req, res);

    // Expect the status code to be 404
    expect(res.statusCode).toBe(404);

    // Expect the response JSON to have the correct error message
    expect(res._getJSONData()).toEqual({ message: "Not Found" });
  });

  test("3. should save announcement successfully", async () => {
    MongooseClass.insertRecord = jest.fn().mockResolvedValue({

    });

    const req = createRequest({
      body: {
        username: "test_user",
        announcement_content: "Test announcement",
      },
    });
    const res = createResponse();

    await EmergencyAnnouncement.save_announcement(req, res);

    expect(res.statusCode).toBe(200);
  });

  test('4. should handle error when saving announcement fails', async () => {
    MongooseClass.insertRecord.mockRejectedValue(
      new Error('Failed to save announcement')
    );

    const req = createRequest({
      body: {
        username: 'test_user',
        announcement_content: 'Test announcement',
      },
    });
    const res = createResponse();

    const consoleLogSpy = jest.spyOn(console, 'log');
    consoleLogSpy.mockImplementation(() => { });

    await EmergencyAnnouncement.save_announcement(req, res);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Inserting record into voice_msg_model failed, look up constraints in model:',
      expect.any(Error)
    );
    consoleLogSpy.mockRestore();
  });

  test('5. should delete an announcement successfully', async () => {
    MongooseClass.deleteRecord = jest.fn().mockResolvedValue(true);

    const req = createRequest({
      body: {
        id: 'mock_id',
      },
    });
    const res = createResponse();

    await EmergencyAnnouncement.delete_announcement(mockIo, req, res);

    expect(MongooseClass.deleteRecord).toHaveBeenCalled();
    expect(mockIo.emit).toHaveBeenCalledWith('delete_emergency_announcement');
    expect(res.statusCode).toBe(204);
  });

  test('6. should handle error when deleting announcement fails', async () => {
    MongooseClass.deleteRecord = jest.fn().mockRejectedValue(new Error('Failed to delete announcement'));

    const req = createRequest({
      body: {
        id: 'mock_id',
      },
    });
    const res = createResponse();

    const consoleLogSpy = jest.spyOn(console, 'log');
    consoleLogSpy.mockImplementation(() => { });

    await EmergencyAnnouncement.delete_announcement(mockIo, req, res);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'In voice_msg_controller: Failed to delete announcement message with id mock_id'
    );
    expect(res.statusCode).toBe(404);
    consoleLogSpy.mockRestore();
  });

  test('7. should modify an announcement successfully', async () => {
    MongooseClass.findAndUpdate = jest.fn().mockImplementation(() => Promise.resolve(true));

    const req = createRequest({
      body: {
        id: 'mock_id',
        new_content: 'New announcement content',
      },
    });
    const res = createResponse();

    await EmergencyAnnouncement.modify_announcement(mockIo, req, res);

    expect(MongooseClass.findAndUpdate).toHaveBeenCalled();
    expect(mockIo.emit).toHaveBeenCalledWith('new_emergency_announcement');
    expect(res.statusCode).toBe(200);
  });

  test('8. should handle error when modifying announcement fails', async () => {
    MongooseClass.findAndUpdate = jest.fn().mockImplementation(() => Promise.reject(new Error('Failed to modify announcement')));

    const req = createRequest({
      body: {
        id: 'mock_id',
        new_content: 'New announcement content',
      },
    });
    const res = createResponse();

    const consoleLogSpy = jest.spyOn(console, 'log');
    consoleLogSpy.mockImplementation(() => { });

    await EmergencyAnnouncement.modify_announcement(mockIo, req, res);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'In voice_msg_controller: Failed to modify announcement message with id mock_id'
    );
    expect(res.statusCode).toBe(404);
    consoleLogSpy.mockRestore();
  });

  test('9. should post an announcement successfully', async () => {
    const saveAnnouncementSpy = jest.spyOn(EmergencyAnnouncement, 'save_announcement');
    saveAnnouncementSpy.mockImplementation(() => Promise.resolve());

    const req = createRequest({
      body: {
        username: 'test_user',
        announcement_content: 'Test announcement',
      },
    });
    const res = createResponse();

    await EmergencyAnnouncement.post_announcement(mockIo, req, res);

    expect(saveAnnouncementSpy).toHaveBeenCalled();
    expect(mockIo.emit).toHaveBeenCalledWith('new_emergency_announcement');
    expect(res.statusCode).toBe(200);

    saveAnnouncementSpy.mockRestore();
  });

  test("10. it should return 400 with a Bad Request status when missing required fields", async () => {
    const req = createRequest({ body: { /* Missing username and announcement_content */ } });
    const res = createResponse();

    await EmergencyAnnouncement.save_announcement(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: "Bad Request",
      message: "Missing required fields",
    });
  });

  test("11. it should return 400 with a Bad Request status when missing required fields", async () => {
    const req = createRequest({ body: { /* Missing id */ } });
    const res = createResponse();

    await EmergencyAnnouncement.delete_announcement({}, req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: "Bad Request",
      message: "Missing required fields",
    });
  });

  test("12. it should return 400 with a Bad Request status when missing required fields", async () => {
    const req = createRequest({ body: { /* Missing id and/or new_content */ } });
    const res = createResponse();

    await EmergencyAnnouncement.modify_announcement({}, req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: "Bad Request",
      message: "Missing required fields",
    });
  });



});
