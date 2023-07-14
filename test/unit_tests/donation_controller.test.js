import MessageDonation_controller from "../../controller/resource_controller.js";
import MongooseClass from "../../utils/database.js";
import donation_msg_model from "../../models/donation_resource_msg.js";
import citizen_model from "../../models/citizens.js";
import {jest} from "@jest/globals";
import { createRequest, createResponse } from "node-mocks-http";



describe("MessageDonation_controller", () => {
    describe("broadcast", () => {


        test("1should return 200 with success message", async () => {
            // Mock the MongooseClass.findAllRecords method to return a mock result
            MongooseClass.findAllRecords = jest.fn().mockResolvedValue([ {
                "_id": {
                "$oid": "643454ce409c2ab3ea6d883b"
                },
                "username": "xhrxhr",
                "password": "$2a$10$vs8jYjUGXPdUrXa13MOUBePCWXdkqfgPxrXKJrbIPbJiSR/jMXnMq",
                "status": "offline",
                "emergency_status": "Help",
                "emergency_status_time": "4/10/2023, 11:26:32 AM",
                "authority": "citizen",
                "__v": 0
            } ]);

            // Mock the MongooseClass.insertRecord method to be successful
            MongooseClass.insertRecord = jest.fn().mockRejectedValue();

            // const req = { body: { user: "xhrxhr", resource: "food", resource_quantity: 10, msg_status: "available", location_info: "test location" } };
            // const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const req = createRequest();
            const res = createResponse();
            req.body = { user: "xhrxhr", resource: "food", resource_quantity: 10, msg_status: "available", location_info: "test location" };
            res.json = jest.fn();
            const io = { emit: jest.fn() };
            await MessageDonation_controller.broadcast(req, res, io);
            expect(res.statusCode).toBe(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Message Sent Successfully" });
            //expect(MongooseClass.findAllRecords).toHaveBeenCalledWith(citizen_model, {username: "xhrxhr"});
            //expect(MongooseClass.insertRecord).toHaveBeenCalledWith();
            //expect(io.emit).toHaveBeenCalledWith("emit-donation-msg", req.body, expect.anything(), "normal");
            MongooseClass.findAllRecords.mockRestore();
            MongooseClass.insertRecord.mockRestore();
        });

        test("2should return 400 with error message", async () => {
            // Mock the MongooseClass.findAllRecords method to return a mock result
            MongooseClass.findAllRecords = jest.fn().mockResolvedValue([ {
                "username": "xhrxhr",
                "password": "$2a$10$vs8jYjUGXPdUrXa13MOUBePCWXdkqfgPxrXKJrbIPbJiSR/jMXnMq",
                "status": "offline",
                "emergency_status": "Help",
                "emergency_status_time": "4/10/2023, 11:26:32 AM",
                "authority": "citizen",
            } ]);

            // Mock the MongooseClass.insertRecord method to be successful
            MongooseClass.insertRecord = jest.fn().mockRejectedValue(() => {
                throw new Error("Inserting record into donation_msg_model failed, look up constraints in model");
            });

            // const req = { body: { user: "xhrxhr", resource: "food", resource_quantity: 10, msg_status: "available", location_info: "test location" } };
            // const res = { };
            const req = createRequest();
            const res = createResponse();
            req.body = { user: "xhrxhr", resource: "food", resource_quantity: 10, msg_status: "available", location_info: "test location" };
            //res.json = jest.fn();
            res.status = jest.fn().mockReturnThis();
            const io = { emit: jest.fn() };
            //MongooseClass.insertRecord = jest.fn().mockRejectedValue();
            await MessageDonation_controller.broadcast(req, res, io);
            expect(res.status).toHaveBeenCalledWith(400);
            //expect(res.json).toHaveBeenCalledWith({ message: "Inserting record into donation_msg_model failed, look up constraints in model" });
            MongooseClass.findAllRecords.mockRestore();
            MongooseClass.insertRecord.mockRestore();
        }
        );

        test("3should return 500 with error message", async () => {
            // Mock the MongooseClass.findAllRecords method to always fail
            const mockFindAllRecords = jest.fn().mockRejectedValue(new Error("Reading record failed, look up constraints in model"));
            MongooseClass.findAllRecords = mockFindAllRecords;
        
            // Create a mock request and response object
            const req = createRequest({ body: { user: "xhrxhr", resource: "food", resource_quantity: '10', msg_status: "available", location_info: "test location" } });
            const res = createResponse();
            res.status = jest.fn().mockReturnThis();
            const io = { emit: jest.fn() };
        
            // Call the broadcast method
            await MessageDonation_controller.broadcast(req, res, io);
        
            // Assert that the response is as expected
            expect(res.status).toHaveBeenCalledWith(500);
            //expect(res.json).toHaveBeenCalledWith({ message: "Reading record failed, look up constraints in model" });
        
            // Restore the mock function
            mockFindAllRecords.mockRestore();
        });
        
        test("4should return 200 with success message", async () => {
          const expectedData = [{ username: 'user1', quantity: "100" }, { username: 'user2', quantity: "50" }];
      
          // Create a mock function that returns the expected data
          const mockAggregate = jest.fn().mockResolvedValue(expectedData);
      
          // Assign the mock function to the aggregate property of the donation_msg_model
          donation_msg_model.aggregate = mockAggregate;
      
          // Call the readall method
          const req = createRequest();
          const res = createResponse();
          res.json = jest.fn();
          await MessageDonation_controller.readall(req, res);
      
          // Assert that the response is as expected
          expect(res.statusCode).toBe(200);
          //expect(res.json).toHaveBeenCalledWith({donations: expectedData});
      
          // Assert that the aggregate function was called with the correct arguments
          expect(mockAggregate).toHaveBeenCalledWith([
            {
              $sort: { timesent: -1 }
            }
            // {
            //   $group: {
            //     _id: "$username",
            //     donation_msg: { $first: "$$ROOT" }
            //   }
            // },
            // {
            //   $replaceRoot: { newRoot: "$donation_msg" }
            // },
            // {
            //   $sort: { timesent: -1 }
            // }
          ]);
      });


          

          test("6should return 200 with success message", async () => {
            // Mock the MongooseClass.deleteByUser method to be successful
            const mockDeleteByUser = jest.fn().mockResolvedValue({});
            MongooseClass.deleteRecord = mockDeleteByUser;
          
            // Create a mock request and response object
            const req = { body: { delete_msg: "yes", user: "user1" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
          
            // Call the deleteByUser method
            await MessageDonation_controller.deleteByUser(req, res);
          
            // Assert that the response is as expected
            expect(res.status).toHaveBeenCalledWith(200);
            //expect(res.json).toHaveBeenCalledWith({ message: "Message Delete Successfully" });
          
            // Assert that the MongooseClass.deleteByUser method was called with the correct arguments
            expect(mockDeleteByUser).toHaveBeenCalledWith(donation_msg_model, "user1", true);
            MongooseClass.deleteRecord.mockRestore();
          });
          
            test("7should return 400 when sending bad request", async () => {
                // Mock the MongooseClass.deleteByUser method to be failed
                const mockDeleteByUser = jest.fn().mockRejectedValue(new Error("Deleting record failed, look up constraints in model"));
                MongooseClass.deleteRecord = mockDeleteByUser;

                // Create a mock request and response object
                // Call the deleteByUser method with an invalid delete_choice value
                const req = createRequest({ body: { delete_msg: "no", user: "test_user" } });
                const res = createResponse();
                res.status = jest.fn();
                //res.json = jest.fn();
                await MessageDonation_controller.deleteByUser(req, res);

                // Assert that the response is as expected
                expect(res.status).toHaveBeenCalledWith(400);
                //expect(res.json).toHaveBeenCalledWith({ message: "Message Not Deleted" });

                // Restore the mock function
                mockDeleteByUser.mockRestore();
            });

            test("8should return 500 with error message", async () => {
                // Mock the MongooseClass.deleteByUser method to be failed
                const mockDeleteByUser = jest.fn().mockRejectedValue(new Error("Deleting record failed, look up constraints in model"));
                MongooseClass.deleteRecord = mockDeleteByUser;

                // Create a mock request and response object
                // Call the deleteByUser method with an invalid delete_choice value
                const req = createRequest({ body: { delete_msg: "yes", user: "test_user" } });
                const res = createResponse();
                res.status = jest.fn();
                //res.json = jest.fn();
                await MessageDonation_controller.deleteByUser(req, res);

                // Assert that the response is as expected
                expect(res.status).toHaveBeenCalledWith(500);
                //expect(res.json).toHaveBeenCalledWith({ message: "Message Not Deleted" });

                // Restore the mock function
                mockDeleteByUser.mockRestore();

            });

                test('11 should return 500 when updating record into donation_msg_model fails', async () => {
                    // Mock the MongooseClass.updateRecord method to throw an error
                    const mockUpdateRecord = jest.fn().mockRejectedValue(new Error('Updating record into donation_msg_model failed, look up constraints in model'));
                    MongooseClass.findAndUpdate = mockUpdateRecord;
                  
                    // Create a mock request and response object
                    // Call the updateStatus method with invalid update_choice and username values
                    const req = {
                      body: {
                        msg_status: 'available',
                        username: 'testname',
                      },
                    };
                    const res = createResponse();
                    res.status = jest.fn();

                    await MessageDonation_controller.updateStatus(req, res);
                  
                    // Assert that the response is as expected
                    expect(res.status).toHaveBeenCalledWith(500);
                    
                    // Restore the mock function
                    mockUpdateRecord.mockRestore();
                  });

                  test('12should return 200 when updating record into donation_msg_model succeeds', async () => {
                    // Mock the MongooseClass.updateRecord method to return a success message
                    const mockUpdateRecord = jest.fn().mockResolvedValue('Message Updated Successfully');
                    MongooseClass.updateRecord = mockUpdateRecord;
                  
                    // Create a mock request and response object
                    // Call the updateStatus method with valid update_choice and username values
                    const req = {
                      body: {
                        donation_status: 'available',
                        user: 'testUser',
                      },
                    };
                    const res = createResponse();
                    res.status = jest.fn();

                    await MessageDonation_controller.updateStatus(req, res);
                  
                    // Assert that the response is as expected
                    expect(res.status).toHaveBeenCalledWith(200);
                    
                    // Restore the mock function
                    mockUpdateRecord.mockRestore();
                  });
                
    });
});
