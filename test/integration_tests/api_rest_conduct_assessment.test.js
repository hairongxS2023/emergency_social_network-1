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
  timeout: 10000,
});


// // Retrieve all assessments:
// // GET /api/citizens/assessments
// this.routers
// .get(Test.checkTestMode,async (req, res) => {
//   assessmentController.GetAssessments(req,res);
// });
test('GET /api/citizens/records', async () => {

  try {
    const response = await api.get('/api/citizens/records', {
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


// Create a new records:
// POST /api/records
// this.router
//   .route('/api/records')
//   .post(Test.checkTestMode, async (req, res) => {
//     assessmentRecordController.CreateAssessment(req,res);
//   });
test('POST /api/records', async () => {

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

    const response = await api.post('/api/records', finishedQuiz, {
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


// Retrieve a specific records:
// GET /api/citizens/records
// this.router
//   .route('/api/citizens/records/:id')
//   .get(Test.checkTestMode,async (req, res) => {
//     assessmentRecordController.GetAssessments(req,res);
//   });

test('GET /api/citizens/records/:id', async () => {

  try {
    const idName = "Flood Assessment for citizens";
    const response = await api.get('/api/citizens/records/:id', {
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


    // Update a records:
    // PUT /api/citizens/records/:id
    // this.router
    //   .route('/api/citizens/records/:id')
    //   .put(Test.checkTestMode, async (req, res) => {
    //     assessmentRecordController.UpdateAssessmet(req,res);
    //   });

    test('PUT /api/citizens/records/:id', async () => {

      try {
        const idName = "Flood Assessment for citizens";
        const response = await api.get('/api/citizens/records/:id', {
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
    

    // Delete a records:
    // DELETE /api/citizens/records/:id
    // this.router
    //   .route('/api/citizens/records/:id')
    //   .delete(Test.checkTestMode,async (req, res) => {
    //     assessmentRecordController.DeleteAssessment(req,res);
    //   });



