import MongooseClass from "../utils/database.js";
import citizen_model from "../models/citizens.js";
import assessment from "../models/assessmentModel.js";
import { uuid } from 'uuidv4';
class assessmentController {



  static async GetAssessments(req, res) {
    try {
      const assessmentAll = await assessment.find({}).sort({date: -1});
      res.json(assessmentAll);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving assessments');
    }
  }

  
  static async GetAssessmetsNoOrder(req, res) {
    try {
      const assessmentAll = await assessment.find({});
      res.json(assessmentAll);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving assessments');
    }
  }


  // user by put.
  static async UpdateAssessmet(req, res) {
    this.addAssessment(req, res);
  }


  static async DeleteAssessmentByTestname(req, res) {
    try {
      const testname = req.params.testname;
      const deletedAssessment = await assessment.deleteMany({ testname: testname });
      if (!deletedAssessment.deletedCount) {
        return res.status(404).send('Assessment not found');
      }
      res.json(deletedAssessment);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting assessment');
    }
  }

  
  static async DeleteAssessmet(req, res) 
  {
   
    try {
    const testname = req.params.id;
    const deletedAssessment = await assessment.deleteMany({ testname: testname });
    if (deletedAssessment.deletedCount>=0) {
      res.status(200).send('delete request processed!');
    }else{
      res.status(404).send('Assessment not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting assessment');
  }

  }



  // used by post
  static async CreateAssessment(req, res) {

    this.addAssessment(req, res);
  }
  
  async addAssessment(req, res) {
    try {
  
      let assessmentData = req.body;
      let testNameData = assessmentData.testname;
      let assessmentIdData = uuid();
      let testQuestions = assessmentData.questions;
    
      let assessmentObj = {
        assessmentId: assessmentIdData,
        username: 'NA',
        score: 'NA',
        testname: testNameData,
        answers: testQuestions
      };
    
      let createdAssessment = await assessment.create(assessmentObj);
      res.status(200).json({
        success: true,
        message: 'Assessment created successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(400).send("Error");
    }
  }


}

export default assessmentController;