import MongooseClass from "../../utils/database.js";
import Speed_test from "../../controller/speed_test_controller.js";
import MessagePublic from "../../controller/public_message_controller.js";

import { jest } from '@jest/globals'

// const mockReqeust = ( username, body ) =>
// {
//     return {
//         username,
//         body
//     }
// };

// const mockResponse = () =>
// {
//     const res = {};
//     res.status = jest.fn().mockReturnValue( res );
//     res.json = jest.fn().mockReturnValue( res );
//     return res;
// };

const req = {};
const res = {};

describe('Speed_test', () => {
  // Test the init method
  describe('init', () => {
    it('should call the switch_to_test_DB method of the MongooseClass', () => {
      // Create a spy on the switch_to_test_DB method of the MongooseClass
      const spy = jest.spyOn(MongooseClass, 'switch_to_test_DB');
      
      // Call the init method of the Speed_test class
      Speed_test.init(req, res);
      
      // Expect the switch_to_test_DB method to have been called
      expect(spy).toHaveBeenCalled();
      
      // Clean up the spy
      spy.mockRestore();
    });
  });
  
  // Test the stop method
  describe('stop', () => {
    it('should call the delete_DB method of the MongooseClass', () => {
      
      
      // Create a spy on the stop_test_DB method of the MongooseClass
      const spy = jest.spyOn(MongooseClass, 'delete_DB');
      
      // Call the stop method of the Speed_test class
      Speed_test.stop(req, res);
      
      // Expect the stop_test_DB method to have been called
      expect(spy).toHaveBeenCalled();
      
      // Clean up the spy
      spy.mockRestore();
    });
  });

  // Test the stop method
  // describe('stop', () => {
  //   it('should call the stop_test_DB method of the MongooseClass', () => {
      
      
  //     // Create a spy on the stop_test_DB method of the MongooseClass
  //     const spy = jest.spyOn(MongooseClass, 'stop_test_DB');
      
  //     // Call the stop method of the Speed_test class
  //     Speed_test.stop(req, res);
      
  //     // Expect the stop_test_DB method to have been called
  //     expect(spy).toHaveBeenCalled();
      
  //     // Clean up the spy
  //     spy.mockRestore();
  //   });
  // });
});
