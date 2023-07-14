## API Documentation for Administer User Profile

## Overview

Resource Endpoint: `/user-profiles`

Description: The use case allows the Administrator to change the profile information related to a user.


Authentication:

Authentication is required for all endpoints.

### Methods:

#### 1. GET /user-profiles

Description: Retrieve all user profiles 

Response:

Status code: `200 OK`

Status code: `400 Bad Request`

Status code: `500 Internal Error`

### Response

Body: 

```json
{
    "profiles": [
        {   
            "_id":"AJInlbnOUP",
            "username": "Jason",
            "password":"Rd2WGTeX7FRasdfdvsbdej0yb",
            "privilege": "Citizen",
            "status": "Active",
        },
        {   
            "_id":"asdkjfDfjh",
            "username": "Ray",
            "password":"RdsdfTeX7FRwWEIF5vsbdej0yb",
            "privilege": "Administrator",
            "status": "Active",
        },
        {   
            "_id":"asdf123sdfd",
            "username": "Harris",
            "password":"Rd2WGTeX7FRwWEIF5vsbdej0yb",
            "privilege": "Citizen",
            "status": "Active",
        },
    ]
}
```

#### 2. GET /user-profiles/${username}

Description: Retrieve the user profile from the given username

Response:

Status code: `200 OK`

Status code: `404 User Not Found`

Status code: `500 Internal Error`

### Response

Body: 

```json
{
    "profile": [
        {   
            "_id":"AJInlbnOUP",
            "username": "Jason",
            "password":"Rd2WGTeX7FRwWEIF5vsbdej0yb",
            "privilege": "Citizen",
            "status": "Active",
        },
    ]
}
```

#### 3. PUT /user-profiles/account-statuses
Description: Swtich any user's account between Active & Inactive.

### Request:

Body:
```json
{   
    "username": "John Doe",
    "status":"Active"
}

```

### Response:

Status code: `200 OK`

Status code: `400 Bad Request`

Status code: `401 User making the PUT request is not an administrator`

Status code: `404 User Not Found`


#### 4. PUT /user-profiles/privilege-levels
Description: Could switch any user’s account among Administrator, Coordinator, Citizen. By default, any new account created has the Citizen privilege.

### Request:

Body:
```json
{   
    "username": "John Doe",
    "privilege":"Administrator"
}

```

### Response:

Status code: `200 OK`

Status code: `400 Bad Request`

Status code: `401 User making the PUT request is not an administrator`

Status code: `404 User Not Found`


#### 5. PUT /user-profiles/usernames

Description: Could change any user’s username


### Request:

Body:
```json
{   
    "username": "John Doe",
    "newusername":"Harris123"
}

```

### Response:

Status code: `200 OK`

Status code: `400 Bad Request`

Status code: `401 User making the PUT request is not an administrator`

Status code: `404 User Not Found`

Status code: `422 new username does not meet the requirements`



#### 6. PUT /user-profiles/passwords

Description: Could change any user’s username


### Request:

Body:

```json
{   
    "username": "John Doe",
    "newpassword":"1234"
}

```

### Response:

Status code: `200 OK`

Status code: `400 Bad Request`

Status code: `401 User making the PUT request is not an administrator`

Status code: `404 Not Found`

Status code: `422 new password does not meet the requirements`

