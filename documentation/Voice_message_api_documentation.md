## API Documentation for Emergency Voice Message

## Overview

Resource Endpoint: `/voice-messages`

Description: This resource is used to manage emergency voice messages.

Authentication:

Authentication is required for all endpoints.

### Methods:

#### 1. GET /voice-messages

Description: Retrieve a list of all emergency voice messages.

Response:

Status code: `200 OK`

Status code: `500 Internal Error`

Body: 

```json
{
    "messages": [
        {   
            "_id":"AJInlbnOUP",
            "sender": "Jason",
            "voicedata": <Binary File>,
            "timesent": "2022-11-04 14:56:35 AM",
        },
        {   
            "_id":"WsdSkOlsd",
            "sender": "Harris",
            "voicedata": <Binary File>,
            "timesent": "2022-11-04 14:58:35 AM",
        }
    ]
}
```

#### 2. POST /voice-messages
Description: Create a new emergency voice message.

Request:

Body:
```json
{   
    "username": "John Doe",
}

```
file:
```json
{
    "filename":"john-doe-20230329194933.ogg"
}
```

Response:

Status code: `201 Created`

Status code: `400 Bad Request`


Request
#### 3. DELETE /voice-messages
Description: Delet a specific emergency voice message based on its ID.


Example Request

`DELETE /voice-messages`

Body:
```json
{   
    "id":"KoJVJjnASd",
}
```

Response:

Status code: `204 No Content`

Status code: `404 Not Found`
