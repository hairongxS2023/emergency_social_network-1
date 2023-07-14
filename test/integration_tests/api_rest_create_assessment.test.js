import axios from 'axios';
import {
  expect
} from 'chai';
import Auth from '../../middleware/auth.js';

const payload = {
  username: "testname",
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
  timeout: 20000,
});


// // Retrieve all assessments:
// // GET /api/citizens/assessments
// this.routers
// .get(Test.checkTestMode,async (req, res) => {
//   assessmentController.GetAssessments(req,res);
// });
test('GET /api/citizens/assessments', async () => {

  try {
    const response = await api.get('/api/citizens/assessments', {
      headers: {
        'Cookie': `access_token=${jwtToken}`,
      }
    });
    expect(response.status).to.equal(200);
  } catch (err) {
    console.log(err);
    throw err;
  }
});



// //Use Case #1: Create Self Assessment
// // Create a new assessment:
// // POST /api/assessments
// this.router
//   .route('/api/assessments')
//   .post(Test.checkTestMode,async (req, res) => {
//     assessmentController.CreateAssessment(req,res);
//   });
test('POST /api/assessments', async () => {

  const finishedQuiz = {
    "testname": "aSimpleTest",
    "questions": [{
      "question": "aSimpleQuestion",
      "choices": [{
        "text": "asimpleAnswer_A",
        "isCorrect": false
      }, {
        "text": "asimpleAnswer_A",
        "isCorrect": true
      }]
    }]
  };


  try {

    const response = await api.post('/api/assessments', finishedQuiz, {
      headers: {
        Cookie: `access_token=${jwtToken}`,
      },
    });

    expect(response.status).to.equal(200);
  } catch (err) {
    console.log(err);
    throw err;
  }
});



// // Retrieve a specific assessment:
// // GET /api/citizens/assessments/:id
// this.router
// .route('/api/citizens/assessments/:id')
// .get(Test.checkTestMode,async (req, res) => {
// assessmentController.GetAssessments(req,res);
// });
test('GET /api/citizens/assessments/:id', async () => {

  try {

    const testname="aSimpleTest"
    const response = await api.get('/api/citizens/assessments/', {
      headers: {
        'Cookie': `access_token=${jwtToken}`,
      }
    });
    expect(response.status).to.equal(200);
  } catch (err) {
    console.log(err);
    throw err;
  }
});



// // Update a assessment:
// // PUT /api/citizens/assessments/:id
// this.router
//   .route('/api/citizens/assessments/:id')
//   .put(Test.checkTestMode, async (req, res) => {
//     assessmentController.UpdateAssessmet(req,res);
//   });
test('PUT /api/citizens/assessments/:id', async () => {

  try 
  {

    const username="usertest";
    const finishedQuiz = {
      "testname": "aSimpleTest",
      "questions": [{
        "question": "aSimpleQuestion",
        "choices": [{
          "text": "asimpleAnswer_A",
          "isCorrect": false
        }, {
          "text": "asimpleAnswer_A",
          "isCorrect": true
        }]
      }]
    };

    const response = await api.put('/api/citizens/assessments/'+username, finishedQuiz, {
      headers: {
        Cookie: `access_token=${jwtToken}`,
      },
    });
    expect(response.status).to.equal(200);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

test('DELETE /api/citizens/assessments/:id', async () => {
  
  try 
  {

    const username="usertest";
    const finishedQuiz = {
      "testname": "aSimpleTest",
      "questions": [{
        "question": "aSimpleQuestion",
        "choices": [{
          "text": "asimpleAnswer_A",
          "isCorrect": false
        }, {
          "text": "asimpleAnswer_A",
          "isCorrect": true
        }]
      }]
    };

    const response = await api.put('/api/citizens/assessments/'+username, finishedQuiz, {
      headers: {
        Cookie: `access_token=${jwtToken}`,
      },
    });
    expect(response.status).to.equal(200);
  } catch (err) {
    console.log(err);
    throw err;
  }
  ///
  try {
    const testname="aSimpleTest"
    const response = await api.delete('/api/citizens/assessments/'+testname, {
      headers: {
        'Cookie': `access_token=${jwtToken}`,
      }
    });

    expect(response.status).to.equal(200);
  } catch (err) {
    console.log(err);
    throw err;
  }
});


