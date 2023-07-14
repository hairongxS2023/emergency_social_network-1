## API Documentation for Join as a Emergency Volunteer 

## Overview

## Resource Endpoint: `/volunteer-join-requests`

Description: This resource is used to manage emergency volunteer requests

## Authentication:

Authentication is required for all endpoints. Need JWT auth for API Call

### Methods:

#### 1. GET /volunteer-join-requests/:postID

Example Request

`GET /volunteer-join-requests/64391b079683ec0d74f48e0a`

Description: Retrieve the exact volunteer post request given the id

Params:
```
    _id : string(required)
```

Response:

Status code: `200 OK`

Status code: `500 Internal Error`

Body: 

```json
{
    "volunteer_request": [
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

#### 2. POST /volunteer-join-requests
Description: Create a new emergency join as a volunteer request

Request:

Body:
```json
{   
    "_id": "643901c20615ba2e093a9150",
    "postID": "6437bae2cd09420bba26dbb0",
    "requestor": "harris",
    "username": "jason",
    "reason": "I would like to help out",
    "timesent": "4/14/2023, 12:33:22 AM",
}
```

Response:

Status code: `201 Created`

Status code: `400 Bad Request`

Request

#### 3. PUT /volunteer-requests-update/

Description: Change a specific emergency volunteer request based on its ID, to add the current volunteer


Params:
```json
{   
    "postID":"6438a6af2e3ead22f94023eb",
    "volunteer":"harris"
}
```

Status code: `200 Success`

Status code: `404 Not Found`
