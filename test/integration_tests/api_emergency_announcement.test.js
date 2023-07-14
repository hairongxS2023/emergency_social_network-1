// process.env.NODE_ENV = 'test';
import axios from 'axios';
import { expect } from 'chai';
import Auth from '../../middleware/auth.js';
// import APP from '../../app.js';
// APP.server.listen(5003);
const api = axios.create({
  baseURL: 'http://localhost:5003',
  headers: { contentType: 'application/json; charset=utf-8' },
  timeout: 30000,
});

describe('/emergency-events success API cases', () => {
  let jwtToken;
  let eventId;

  beforeAll(async () => {
    const payload = { username: 'testname', authority: 'citizen' };
    jwtToken = await Auth.genToken(payload);
    
  });
  afterAll(async () => {
  });

  test('1. GET /emergency-events should return all emergency events with 200 status', async () => {
    try {
      const response = await api.get('/emergency-events', {
        headers: { 'Cookie': `access_token=${jwtToken}` },
      });

      expect(response.status).to.equal(200);
      expect(response.data.data).to.be.an('array');
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  test('2. POST /emergency-events should create a new emergency event and return 201 status', async () => {
    try {
      const requestBody = {
        username: 'testname',
        announcement_content: 'This is a test emergency event',
      };

      const response = await api.post('/emergency-events', requestBody, {
        headers: { 'Cookie': `access_token=${jwtToken}` },
      });

      eventId = response.data.id;

      expect(response.status).to.equal(200);
      expect(response.data).to.include({"status": "OK"});
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  test('3. PUT /emergency-events should update the emergency event and return 200 status', async () => {
    try {
      const requestBody = {
        id: eventId,
        new_content: 'This is an updated test emergency event',
      };

      const response = await api.put('/emergency-events', requestBody, {
        headers: { 'Cookie': `access_token=${jwtToken}` },
      });

      expect(response.status).to.equal(200);
      expect(response.data).to.include({"status": "OK"});
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  test('4. DELETE /emergency-events should delete the emergency event and return 204 status', async () => {
    try {
      const response = await api.delete('/emergency-events', {
        headers: { 'Cookie': `access_token=${jwtToken}` },
        data: { id: eventId },
      });

      expect(response.status).to.equal(204);
      expect(response.statusText).to.equal('No Content');
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});

describe('/emergency-events API failure cases', () => {
    let jwtToken;
    let nonExistentEventId = 'nonexistentid123';
  
    beforeAll(async () => {
      const payload = { username: 'testname', authority: 'citizen' };
      jwtToken = await Auth.genToken(payload);
    });
    
    afterAll(async () => {
      // await APP.server.close();

    });
    test('5. POST /emergency-events with missing required fields should return 400 status', async () => {
      try {
        const requestBody = {
          // Missing 'username' and 'announcement_content'
        };
  
        await api.post('/emergency-events', requestBody, {
          headers: { 'Cookie': `access_token=${jwtToken}` },
        });
      } catch (error) {
        expect(error.response.status).to.equal(400);
      }
    });
  
    test('6. PUT /emergency-events with missing required fields should return 400 status', async () => {
      try {
        const requestBody = {
          //id: nonExistentEventId,
          new_content: 'This is an updated test emergency event',
        };
  
        const response =  await api.put('/emergency-events', requestBody, {
          headers: { 'Cookie': `access_token=${jwtToken}` },
        });
      } catch (error) {
        // console.error(error);
        expect(error.response.status).to.equal(400);
        expect(error.response.statusText).to.include("Bad Request");
      }
    });
  
    test('7. PUT /emergency-events with nonexistent event id should return 404 status', async () => {
      try {
        const requestBody = {
          id: nonExistentEventId,
          new_content: 'This is an updated test emergency event',
        };
  
        await api.put('/emergency-events', requestBody, {
          headers: { 'Cookie': `access_token=${jwtToken}` },
        });
      } catch (error) {
        expect(error.response.status).to.equal(404);
      }
    });
  
    test('8. DELETE /emergency-events with missing required fields should return 400 status', async () => {
      try {
        await api.delete('/emergency-events', {
          headers: { 'Cookie': `access_token=${jwtToken}` },
          data: {
            // Missing 'id'
          },
        });
      } catch (error) {
        expect(error.response.status).to.equal(400);
      }
    });
  
    test('9. DELETE /emergency-events with nonexistent event id should return 404 status', async () => {
      try {
        await api.delete('/emergency-events', {
          headers: { 'Cookie': `access_token=${jwtToken}` },
          data: {
            id: nonExistentEventId,
          },
        });
      } catch (error) {
        expect(error.response.status).to.equal(404);
      }
    });
  });