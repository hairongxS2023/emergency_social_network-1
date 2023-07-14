## API Documentation for Emergency Volunteer Request

## Overview

## Resource Endpoint: `/volunteer-requests`

Description: This resource is used to manage emergency volunteer requests

## Authentication:

Authentication is required for all endpoints. Need JWT auth for API Call

### Methods:

#### 1. GET /volunteer-requests

Description: Retrieve a list of all volunteer post requests

Status code: `200 OK`

Status code: `500 Internal Error`

Body: 

```json
{
    "volunteer_requests": [
        {   
             "_id": "6438a6af2e3ead22f94023eb",
            "user": "jason",
            "type": "Water Supply",
            "details": "123",
            "timesent": "4/13/2023, 6:04:47 PM",
            "volunteers_needed": 123,
            "volunteers_joined": [],
            "fulfilled": false,
            "__v": 0
        },
        {   
            "_id": "64391b079683ec0d74f48e0a",
            "user": "ray",
            "type": "Electricity",
            "details": "I am in need of electricity",
            "timesent": "4/14/2023, 2:21:11 AM",
            "volunteers_needed": 4,
            "volunteers_joined": [
                "harri222",
                "harris1"
            ],
            "fulfilled": true,
            "__v": 0
        }
    ]
}
```

#### 2. POST /request-submissions
Description: Create a new emergency volunteer request

Request:

Body:
```json
{   
    "username": string(required),
    "type":string(required),
    "details": string(required), 
    "timesent": date(required),
    "volunteers_needed": number(required),
    "volunteers_joined": array[string](optional),
    "fulfilled": boolean(required)
}
```

Response:

Status code: `201 Created`

Status code: `400 Bad Request`

Request

#### 3. PUT /requests-fulfillment/:postID

Description: Change a specific emergency volunteer request based on its ID.

Example Request

`PUT /requests-fulfillment/64391b079683ec0d74f48e0a`

Params:
```json
{   
    "_id":"6438a6af2e3ead22f94023eb",
}
```

Status code: `200 Success`

Status code: `404 Not Found`
