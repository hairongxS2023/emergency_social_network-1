## API Documentation: Emergency Information Announcement Wall

## Overview

This API provides endpoints for citizens to post and view emergency events on the Emergency Information Announcement Wall.

Authentication:

Authentication is required for all endpoints.

### Methods:

#### 1. POST /emergency-events

Description: create and post new emergency events on the Emergency Information Announcement Wall.

Request Body:

```
Parameter	Type	Description

username string  The name of the author
announcement_content string	The event message
```

Request Body Example:

Body:

```json
{   
    "username": "John Doe",
    "announcement_content": "This is an emergency event post",
}
```

Response:
Status code: 
`201    Created`
`400	Bad Request`
`500	Internal Server Error.`

#### 2. PUT /emergency-events

Description: modify an emergency events on the Emergency Information Announcement Wall.

Request Body:

```
Parameter	Type	Description

id          string  Unique id of the event announcement
sender_name	string	The name of the author
new_content	string	The event message
```

Request Body Example:

Body:
```json
{   
    "id":"AJInlbnOUP",
    "sender_name": "John Doe",
    "new_content": "This is an modified emergency event post",
}
```

Response:
Status code: 
`200    OK`
`400    Bad Request`
`404	Not Found`
`500	Internal server error.`

#### 3. GET /emergency-events
Description: Retrieve a list of all emergency events.

Response:

Status code: `200 OK`

Body: 
```json
{
    "messages": [
        {   
            "_id":"AJInlbnOUP",
            "sender": "John Doe",
            "announcement_content": "This is an modified emergency event post",
            "timesent": "2022-11-04 14:56:35 AM"
        },
        {   
            "_id":"WsdSkOlsd",
            "sender": "John Doe",
            "announcement_content": "This is an modified emergency event post",
            "timesent": "2022-11-04 14:56:35 AM" 
        }
    ]
}
```

#### 4. DELETE /emergency-events/

Description: allows citizens to delete their own emergency events from the Emergency Information Announcement Wall.
Path parameters

```
Parameter	Type	Description
id	string	The unique ID of the voice message to delete
```

Example Request

`DELETE /emergency-events`

```json
{
  "id": "WsdSkOlsd"
}
```




Response:

Status code: `204 No Content`

Status code: `404 Not Found`

```json
{
  "error": {
    "code": "error_code",
    "message": "error_message"
  }
}
```
