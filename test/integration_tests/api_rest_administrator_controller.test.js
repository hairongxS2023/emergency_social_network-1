import axios from 'axios';
import {
  expect
} from 'chai';
import Auth from '../../middleware/auth.js';

const payload = {
  username: "user05",
  privilege: "citizen"
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

test('POST /api/administrator/user/password', async () => {
  try {

    const response = await api.post('/api/administrator/user/password', {username: "user05",newpassword:"123456"}, {
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

test('POST /api/administrator/user/username', async () => {
  try {

    const response = await api.post('/api/administrator/user/username', {username: "user05",newusername:"username0005"}, {
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