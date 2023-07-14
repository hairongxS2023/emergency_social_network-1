import sharestatus_controller from "../../controller/sharestatus_controller.js";
import MongooseClass from "../../utils/database.js"
import { createRequest, createResponse } from 'node-mocks-http';
import {jest} from "@jest/globals";
import citizen_model from "../../models/citizens.js";

// describe('sharestatus_controller', () => {
//   describe('updateSharedStatus', () => {
//     it('Check citizen_model.storeStatus for success', async () => {
//       const req = createRequest({
//         body: {
//           citizens: 'testing342423432',
//           emergencyStatus: 'Emergency',
//         },
//       });
//       const res = createResponse();

//       MongooseClass.switch_to_test_DB();
//       await sharestatus_controller.updateSharedStatus(req, res);
//       expect(res.statusCode).toBe(200);
//       expect(res._getData()).toBe('User status updated successfully');
//     });
  
//   });
// });

describe('sharestatus_controller', () => {
  describe('updateSharedStatus', () => {
    it('should return 200 with success message', async () => {
      const req = createRequest({
        body: {
          citizens: 'testing342423432',
          emergencyStatus: 'Emergency',
        },
      });
      const res = createResponse();

      MongooseClass.switch_to_test_DB();
      await sharestatus_controller.updateSharedStatus(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getData()).toBe('User status updated successfully');
    });

    it('should return 400 with error message when citizen_model.storeStatus throws error', async () => {
      const req = createRequest({
        body: {
          citizens: 'testing342423432',
          emergencyStatus: 'Emergency',
        },
      });
      const res = createResponse();

      // mock the storeStatus method to throw an error
      jest.spyOn(citizen_model, 'storeStatus').mockImplementation(() => {
        throw new Error('Some error occurred');
      });

      await sharestatus_controller.updateSharedStatus(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getData()).toBe('Error updating user status');

      // restore the original implementation of storeStatus
      citizen_model.storeStatus.mockRestore();
    });
  });
});

