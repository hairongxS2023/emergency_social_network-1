import axios from 'axios';
import { expect } from 'chai';
import MongooseClass from '../../utils/database';
import Auth from '../../middleware/auth.js';

const payload = { username: "xhrxhr", authority: "citizen" };
let jwtToken;

beforeAll(async () => {
    jwtToken = await Auth.genToken(payload);
    //await MongooseClass.connectLocalDB();
    //await MongooseClass.initDB();
});

afterAll(async () => {
    //await MongooseClass.delete_all(flood_report_model);
    //return;
});

const api = axios.create({
    baseURL: 'http://localhost:5003',
    headers: {contentType :"application/json; charset=utf-8"},
    timeout: 50000,
});

test('POST /donations', async () => {
  try {

    //await MongooseClass.switch_to_test_DB();
    const msg_body = {
      user: 'xhrxhr',
      donation_status: 'available',
      resource: 'food',
      resource_quantity: '1',
      location_info: 'test location',
    };
    const response = await api.post('/donations', msg_body, {
      headers: {
        Cookie: `access_token=${jwtToken}`,
      },
    });

    expect(response.status).to.equal(200);
    expect(response.data.message).to.equal('Message Sent Successfully');
  } catch (err) {
    //console.log(err);
    //console.log(err.response.data);
    throw err;
  }
});



test('GET /donations', async () => {
        
        try{
            const response = await api.get('/donations', {
                headers:{
                    'Cookie': `access_token=${jwtToken}`,
                }
            });
            //console.log(response);
            expect(response.status).to.equal(200);
            //expect(response.data).to.be.an('object');
        }catch(err){
            console.log(err);
            throw err;
        }
    }
);

// test('PUT /donation_statuses', async () => {
//   try {
//     const requestBody = {
//       user: 'xhrxhr',
//       donation_status: 'available',
//     };

//     const response = await api.put('/donation_statuses', requestBody, {
//       headers: {
//         'Cookie': `access_token=${jwtToken}`,
//       }
//     });

//     expect(response.status).to.equal(200);
//     //expect(response.data).to.equal('Message Updated Successfully');
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// });

// the following test cases are not working, due to the mongodb connection issue

// test('DELETE /donations', async () => {
//     try {
//       const response = await api.delete('/donations', {
//         headers: {
//           'Cookie': `access_token=${jwtToken}`,
//         },
//         data: {
//           delete_msg: 'yes',
//           user: 'testname'
//         },
//       });
      
//       expect(response.status).to.equal(200);
//       //expect(response.data).to.equal('Message Deleted Successfully');
//       //expect(response.data).to.be.undefined;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   });




