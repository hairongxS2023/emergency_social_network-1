import mongoose from "mongoose";
import MongooseClass from "../utils/database.js"
import Time from "../utils/time.js"
import { uuid } from 'uuidv4';

const assessmentrecord = new mongoose.Schema({
  assessmentId: { type: String, required: false },
  username: { type: String, required: false },
  testname: { type: String, required: false },
  score: { type: String, required: false },
  date: { type: Date, required: false, default: Date.now },
  answers: [{
    question: { type: String, required: false },
    choices: [{
      text: { type: String, required: false },
      isCorrect: { type: Boolean, required: false }
    }]
  }]
});


assessmentrecord.statics.CreateAssessment = async (req, res) => {

  const assessmentData = req.body;
  const assessmentIdData = assessmentData.assessmentId;
  const testNameData = assessmentData.testname;
  const testQuestions = assessmentData.questions;

  const assessmentObj = {
    assessmentId: assessmentIdData,
    username: 'NA',
    score: 'NA',
    testname: testNameData,
    answers: testQuestions
  };
  
  const createdAssessment = await assessmentRecord.create(assessmentObj);
};


// Create the model
const assessmentRecord = mongoose.model('assessmentRecord', assessmentrecord);
export default assessmentRecord;