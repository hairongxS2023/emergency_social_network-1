import MongooseClass from "../utils/database.js";
import citizen_model from "../models/citizens.js";
import assessmentRecord from "../models/assessmentRecord.js";
import { uuid } from 'uuidv4';
class assessmentRecordController {



  static async GetAssessments(req, res) {
    try {
      const assessmentAll = await assessmentRecord.find({}).sort({date: -1});
      res.status(200).json(assessmentAll);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving assessments');
    }
  }

  
  static async GetAssessmetsNoOrder(req, res) {
    try {
      const assessmentAll = await assessmentRecord.find({});
      res.json(assessmentAll);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving assessments');
    }
  }


//For Records
  static async UpdateAssessmet(req, res) {
    try {

 
       const udpatedQuestions = req.body;
       console.log(JSON.stringify(udpatedQuestions));
       
       
       
       
       const username = req.params.id;
       
       const useranswers=udpatedQuestions[0].useranswers;
       console.log(udpatedQuestions[0]);
       

       const conductedAssessment = udpatedQuestions[0].conductedAssessment;
       console.log(JSON.stringify(conductedAssessment));
       console.log(Array.isArray(useranswers));


       
       let correctAnswers = 0;
       const totalQuestions = conductedAssessment.length;
       
       for (const key in useranswers) {
         if (key !== 'res') 
         { 
           const question = conductedAssessment.find(q => q.id === key);
           if (question && useranswers[key] === question.options[1])
            {
            
           }
           correctAnswers++;
         }
       }
       
       const percentage = (correctAnswers / totalQuestions) * 100;
       console.log(`Percentage of correct answers: ${percentage}%`);

       try {


  
        const testQuestions = udpatedQuestions[0].takeAssessment.questions;
        const takentest = udpatedQuestions[0].takeAssessment;
        const testNameTaken = udpatedQuestions[0].takeAssessment.testname;
        const assessmentIdData = takentest.assessmentId;

        const assessmentObj = {
          assessmentId: assessmentIdData,
          username: username,
          score: percentage,
          testname: testNameTaken,
          answers: testQuestions
        };
        
        const createdAssessment = await assessmentRecord.create(assessmentObj);
      res.json([{percentageAssessmentResult: percentage,message:`Percentage of correct answers: ${percentage}%`}]);
      } catch (error) {
        console.error(error);
        res.status(400).send("Error");
      }



    } catch (err) 
    {
      console.error(err);
      res.status(500).send('Error retrieving assessments');
    }
  }


  static async DeleteAssessmentByTestname(req, res) {
    try {
      const testname = req.params.testname;
      const deletedAssessment = await assessmentRecord.deleteMany({ testname: testname });
      if (!deletedAssessment.deletedCount) {
        return res.status(404).send('Assessment not found');
      }
      res.json(deletedAssessment);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting assessment');
    }
  }

  
  static async CreateAssessment(req, res) {
    try {
      return res.status(200).send('CreateAssessment success');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting assessment');
    }
  }


  
  static async DeleteAssessment(req, res) {


    try {
      const testname = req.params.id;
      const deletedAssessment = await assessmentRecord.deleteMany({ testname: testname });
      if (!deletedAssessment.deletedCount) {
        return res.status(404).send('Assessment not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting assessment');
    }

  }


static async SaveRecord(req, res) 
  {
    try
     {
      assessmentRecord.SaveRecord(req,res);
    } catch (err) {
      res.status(500).send('Error saving assessment');
    }
  }
  

}
export default assessmentRecordController;