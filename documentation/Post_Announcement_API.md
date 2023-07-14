# ESN Post Announcement API Documentation

### Overview

The Post Announcement feature allows Coordinator to create and send announcements to users in public. Announcements are sent as system messages and are highlighted to ensure visibility. This feature can be used to share important updates, news, or events with chat group members.

### Endpoint

**POST** `/announcements`

### Request Body

| Field          | Type    | Description                                                 |
|----------------|---------|-------------------------------------------------------------|
| `sender`       | string  | The sender of the announcement (username).                  |
| `announcement_content`      | string  | The content of the announcement (max 2000 characters).      |

### Example Request Body

```json
{
  "Sender": "Hakan",
  "announcement_content": "We will be performing scheduled maintenance on our servers on March 25, 2023",
}
```
## Response

Success
* Status Code: 201 Created
The announcement is successfully created

Error
* Status Code: 400 Bad Request

* Status Code: 403 Forbidden
User does not have permission to post an announcement

### Endpoint

**GET** `/announcements`

## Response
Success
* Status Code: 200 Success
Successfully found the history message    

Error
* Status Code: 404 Not Found
The history announcement is not found
