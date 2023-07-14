# Share Status API Documentation
This API allows users to share their emergency status with other users. The following sections describe the details of this API.

## Use Case
The Share Status API enables a Citizen to share their emergency status with other users.

## Associated Use Case
The Associated Use Case for the Share Status API is called Sharestatus.

## Dependent Use Cases

The Dependent Use Cases for the Share Status API are ESNDirectory and Public Chat Room.

## Open Endpoints

The Share Status API provides a single open endpoint:

### Update Emergency Status

This endpoint is used to update the emergency status of the user and share it with other users.

### Request Parameters
PUT /users/:username/EmergencyLevels

| Parameter | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| `username`   | string | Yes      | The username of the user who is updating their emergency status. |
| `emergencyStatus` | string | Yes | The emergency status of the user. This can be one of the following values: "red", "yellow", "green", or "clear". |
| `citizens` | string | Yes | The username of the user who is sharing their emergency status. |

###  Request

```json
{
  "emergencyStatus": "Help",
  "citizens": "user1"
}



###  Response

###  Success Status Code
The Success Status Code for the Share Status API is 200 OK.

###  Fail Status Code
The Fail Status Code for the Share Status API is 400 Bad Request.