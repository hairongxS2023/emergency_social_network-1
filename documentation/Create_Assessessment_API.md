Use Case #1: Create Self Assessment

Create a new self-assessment:
    POST /api/citizens/self-assessments
Retrieve all self-assessments:
    GET /api/citizens/self-assessments
Retrieve a specific self-assessment:
    GET /api/citizens/self-assessments/{id}
Update a self-assessment:
    PUT /api/citizens/self-assessments/{id}
Delete a self-assessment:
    DELETE /api/citizens/self-assessments/{id}

Use Case #2: Conduct Survey Self Assessment
Start a new self-assessment:
    POST /api/citizens/self-assessments/{id}/responses
Retrieve all self-assessment responses:
    GET /api/citizens/self-assessments/{id}/responses
Retrieve a specific self-assessment response:
    GET /api/citizens/self-assessments/{id}/responses/{id}
Update a self-assessment response:
    PUT /api/citizens/self-assessments/{id}/responses/{id}
Delete a self-assessment response:
    DELETE /api/citizens/self-assessments/{id}/responses/{id}