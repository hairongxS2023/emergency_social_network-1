import axios from 'axios';
import { expect } from 'chai';
import Auth from '../../middleware/auth.js';
import MongooseClass from '../../utils/database.js';
import flood_report_model from '../../models/flood_report.js';
import { Mongoose } from 'mongoose';
import {jest} from '@jest/globals';

const payload = { username: "testname", authority: "citizen" };
let jwtToken;
let report_id;
let report_id2;
let report_id3;
const newModel1 = new flood_report_model({
  poster: "testname1",
  location: "CMU silicon valley",
  image_source: {
    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    contentType: "image",
  },
  time: "2021-05-01T00:00:00.000Z",
  up_vote: 0,
  down_vote: 0,
  voter_list: [],
  _id: "1",
});
const newModel2 = new flood_report_model({
  poster: "testname2",
  location: "CMU silicon valley",
  image_source: {
      data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      contentType: "image",
  },
  time: "2022-05-01T00:00:00.000Z",
  up_vote: 0,
  down_vote: 0,
  voter_list: [],
  _id: "2",
});
const newModel3 = new flood_report_model({
  poster: "testname3",
  location: "CMU silicon valley",
  image_source: {
      data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      contentType: "image",
  },
  time: "2022-05-01T00:00:00.000Z",
  up_vote: 0,
  down_vote: 0,
  voter_list: [],
  _id: "3",
});
beforeAll(async ()=>{
    jwtToken = await Auth.genToken(payload);
    //await MongooseClass.closeDB();
    //await MongooseClass.connectLocalDB();
    //await MongooseClass.initDB();
    //await generateRecords();
    MongooseClass.findAllRecordsX = jest.fn().mockResolvedValue([newModel1, newModel2, newModel3]);
    const result = await MongooseClass.findAllRecordsX();
    report_id = result[0]._id;
    report_id2 = result[1]._id;
    report_id3 = result[2]._id;
});

afterAll(async ()=>{
    await MongooseClass.deleteRecord(flood_report_model);
    return;
});

Auth.genToken(payload).then((token)=>{
    const jwtToken = token;
});

const api = axios.create({
    baseURL: 'http://localhost:5003',
    headers: {contentType :"application/json; charset=utf-8"},
    timeout: 30000,
});

test('1POST /flood_reports/new_report_submissions with proper data', async () => {
    try {
  
      // Convert the base64 image data to a Buffer and append it to the form
      const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

      const response = await api.post('/flood_reports',  {
        location: 'Test Location1234',
        poster: 'testname',
        image: base64Image,
        headers: {
          'Cookie': `access_token=${jwtToken}`,
        },
      });
  
      expect(response.status).to.equal(201);
    } catch (err) {
      console.log("flood_report API test failed");
      throw err;
    }
});
  
// Test GET /flood_reports/report_histories
test('2GET /flood_reports/report_histories', async () => {
    try {
      const response = await api.get('/flood_reports', {
        headers: {
          'Cookie': `access_token=${jwtToken}`,
        },
      });
  
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('report_history');
    } catch (err) {
      console.log("GET report_histories test failed");
      throw err;
    }
  });
  
// Test delete /flood_reports
test('3DELETE /flood_reports', async () => {
    try {
        const response = await api.delete('/flood_reports', {
            data: {
                report_id: report_id, // Replace with a test report ID
            },
            headers: {
                'Cookie': `access_token=${jwtToken}`,
            },
        });

        expect(response.status).to.equal(204);
    } catch (err) {
        console.log("delete records_deletions test failed" + err);
        throw err;
    }
});


// Test PATCH /flood_reports
test('4PATCH /flood_reports', async () => {
    try {
        const response = await api.patch('/flood_reports', {
        vote_type: "wrong_vote_type", 
        report_id: report_id2, // Replace with a test report ID
        username: "testname2",
        }, {
        headers: {
            'Cookie': `access_token=${jwtToken}`,
        },
        });
    
        expect(response.status).to.equal(400);
    } catch (err) {
        if (err.response) {
            // Axios received a non-2xx status code
            expect(err.response.status).to.equal(400);
          } else {
            console.log("PATCH records_deletions test failed" + err);
            console.log(err.response ? err.response.data : 'No response data available');
            throw err;
          }
    }
    }, 10000);

    test('5GET /flood_reports/report_histories - empty database', async () => {
        try {
            await MongooseClass.deleteRecord(flood_report_model);
            const response = await api.get('/flood_reports', {
            headers: {
              'Cookie': `access_token=${jwtToken}`,
            },
          });
      
          expect(response.status).to.equal(200);
        //   expect(response.data.report_history).to.be.empty;
        } catch (err) {
          throw err;
        }
      }, 10000);
      
      test('6DELETE /flood_reports - missing report_id', async () => {
        try {
            const response = await api.delete('/flood_reports', {
                data: {report_id:""},
                headers: {
                    'Cookie': `access_token=${jwtToken}`,
                },
            });
    
            expect(response.status).to.equal(400);
        } catch (err) {
            expect(err.response.status).to.equal(400);
        }
    }, 10000);
    
    test('7PATCH /flood_reports - missing report_id', async () => {
        try {
          const response = await api.patch('/flood_reports', {
            username: 'test_username',
            vote_type: 'upvote',
          }, {
            headers: {
              'Cookie': `access_token=${jwtToken}`,
            },
          });
      
          expect(response.status).to.equal(400);
        } catch (err) {
          expect(err.response.status).to.equal(400);
        }
      }, 10000);
      
      test('8GET /flood_report/new_report_page - unauthorized access', async () => {
        try {
          const response = await api.get('/flood_report/new_report_page', {
            maxRedirects: 0, 
          });
      
        
          expect(response.headers.location).to.equal('/'); 
        } catch (err) {
          expect(err.response.headers.location).to.equal('/');
        }
      }, 10000);
    



async function generateRecords(){
    const newModel1 = new flood_report_model({
        poster: "testname1",
        location: "CMU silicon valley",
        image_source: {
          data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
          contentType: "image",
        },
        time: "2021-05-01T00:00:00.000Z",
        up_vote: 0,
        down_vote: 0,
        voter_list: [],
      });
    const newModel2 = new flood_report_model({
        poster: "testname2",
        location: "CMU silicon valley",
        image_source: {
            data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            contentType: "image",
        },
        time: "2022-05-01T00:00:00.000Z",
        up_vote: 0,
        down_vote: 0,
        voter_list: [],
    });
    const newModel3 = new flood_report_model({
        poster: "testname3",
        location: "CMU silicon valley",
        image_source: {
            data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            contentType: "image",
        },
        time: "2022-05-01T00:00:00.000Z",
        up_vote: 0,
        down_vote: 0,
        voter_list: [],
    });

    await MongooseClass.insertRecord(newModel1);
    await MongooseClass.insertRecord(newModel2);
    await MongooseClass.insertRecord(newModel3);
    return;
}