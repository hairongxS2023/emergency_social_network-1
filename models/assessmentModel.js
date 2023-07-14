import mongoose from "mongoose";
import MongooseClass from "../utils/database.js"
import Time from "../utils/time.js"
import { uuid } from 'uuidv4';
const assessmentModel = new mongoose.Schema({
  assessmentId: { type: String, required: true },
  username: { type: String, required: true },
  testname: { type: String, required: true },
  score: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  answers: [{
    question: { type: String, required: true },
    choices: [{
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }]
  }]
});



assessmentModel.statics.CreateAssessment = async (req, res) => {

  const assessmentData = req.body;
  const assessmentIdData = uuid();
  const testNameData = assessmentData.testname;
  const testQuestions = assessmentData.questions;

  const assessmentObj = {
    assessmentId: assessmentIdData,
    username: 'NA',
    score: 'NA',
    testname: testNameData,
    answers: testQuestions
  };

  const createdAssessment = await assessment.create(assessmentObj);
};



const assessment = mongoose.model('assessment', assessmentModel);
export default assessment;
