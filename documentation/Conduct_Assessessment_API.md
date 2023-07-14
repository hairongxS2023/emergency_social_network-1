Use Case:
The Conduct Survey Self-Assessment API enables citizens to create, retrieve, update, and delete their survey self-assessments. 
The API helps citizens assess their level of flood preparedness and identify areas where they need to improve.

Associated Use Case:
The Associated Use Case for the Conduct Survey Self-Assessment API is called "CreateSurveyAssessment".

Open Endpoints:
The Conduct Survey Self-Assessment API provides the following open endpoints:

Create Assessment:
This endpoint is used to create a new survey self-assessment for the citizen.

Request:
POST /api/records/

Parameter	Type	Required	Description
assessment	object	Yes	The assessment object containing the details of the assessment.
assessment.title	string	Yes	The title of the assessment.
assessment.questions	array	Yes	An array of questions for the assessment.
assessment.completed	boolean	No	Indicates whether the assessment has been completed or not. Defaults to false.

{
  "assessment": {
    "title": "Flood Preparedness Survey Assessment",
    "questions": [
      "Do you know the flood risk level in your area?",
      "Do you have flood insurance?",
      "Have you created a flood emergency kit?",
      "Have you conducted a flood risk assessment for your home?",
      "Do you have a flood evacuation plan?",
      "Do you have a backup power source in case of power outages during floods?",
      "Do you know the flood evacuation routes in your area?",
      "Have you participated in any flood preparedness training or drills?"
    ]
  }
}
Response
Success Status Code
The Success Status Code for the Create Assessment endpoint is 201 Created.

Fail Status Code
The Fail Status Code for the Create Assessment endpoint is 400 Bad Request.

Get Assessments
This endpoint is used to retrieve all survey self-assessments for a citizen.

Request
GET /api/citizens/records

Request:
GET /api/citizens/records/:id

Parameter	Type	Required	Description
citizenId	string	Yes	The ID of the citizen whose assessment is being retrieved.
id	string	Yes	The ID of the assessment being retrieved.

Response:
Success Status Code:
The Success Status Code for the Get Assessment by ID endpoint is 200 OK.

Fail Status Code:
The Fail Status Code for the Get Assessment by ID endpoint is 400 Bad Request.

Update Assessment:
This endpoint is used to update an existing survey self-assessment for a citizen.

Request
PUT /api/citizens/records/:id

Parameter	Type	Required	Description
citizenId	string	Yes	The ID of the citizen whose assessment is being updated.
id	string	Yes	The ID of the assessment being updated.
assessment	object	Yes	The updated assessment object.

Example Request:
{
  "assessment": {
    "title": "Flood Preparedness Survey Assessment",
    "questions": [
      "Do you know the flood risk level in your area?",
      "Do you have flood insurance?",
      "Have you created a flood emergency kit?",
      "Have you conducted a flood risk assessment for your home?",
      "Do you have a flood evacuation plan?",
      "Do you have a backup power source in case of power outages during floods?",
      "Do you know the flood evacuation routes in your area?",
      "Have you participated in any flood preparedness training or drills?",
      "Have you installed any flood protection measures in your home?"
    ],
    "completed": true
  }
}


Response:
Success Status Code:
The Success Status Code for the Update Assessment endpoint is 200 OK.

Fail Status Code:
The Fail Status Code for the Update Assessment endpoint is 400 Bad Request.

Delete Assessment:
This endpoint is used to delete a specific survey self-assessment for a citizen.

Request:
DELETE /api/citizens/records/:id

Response:
Success Status Code:
The Success Status Code for the Delete Assessment endpoint is 204 No Content.

Fail Status Code:
The Fail Status Code for the Delete Assessment endpoint is 400 Bad Request.





