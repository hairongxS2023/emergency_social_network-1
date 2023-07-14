import axios from 'axios';
import MongooseClass from "../../utils/database";
import {
  expect
} from 'chai';
import Auth from '../../middleware/auth.js';

const payload = {
  username: "user05",
  password: "user05",
  authority: "citizen"
};

let jwtToken;
beforeAll(async () => [
  jwtToken = await Auth.genToken(payload)
])

Auth.genToken(payload).then((token) => {
  const jwtToken = token;
})

const api = axios.create({
  baseURL: 'http://localhost:5003',
  headers: {
    contentType: "application/json; charset=utf-8"
  },
  timeout: 10000,
});

test('PUT /users/:username/EmergencyLevels', async () => {
  try {

    const response = await api.put('/users/:username/EmergencyLevels', {citizens: "user05",emergencyStatus:"help"}, {
      headers: {
        Cookie: `access_token=${jwtToken}`,
      }
    });
    expect(response.status).to.equal(200);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

test('PUT /users/:username/EmergencyLevels', async () => {
  try {

    const response = await api.put('/users/:username/EmergencyLevels', {citizens: "user05",emergencyStatus:"ok"}, {
      headers: {
        Cookie: `access_token=${jwtToken}`,
      }
    });
    expect(response.status).to.equal(200);
  } catch (err) {
    console.log(err);
    throw err;
  }
});



test('PUT /users/:username/EmergencyLevels', async () => {
  try {

    const response = await api.put('/users/:username/EmergencyLevels', {citizens: "user05",emergencyStatus:"emergency"}, {
      headers: {
        Cookie: `access_token=${jwtToken}`,
      }
    });
    expect(response.status).to.equal(200);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
