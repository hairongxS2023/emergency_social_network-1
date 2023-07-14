# API Documentation for Post and Request Resources after a flood
Post Resources function allows users to post their donation message at the community donation resource page

Request Resources allows users to see all the donation messages and contact with one donator.

## Overview

Information Endpoint: /donations

Description: 
This resource is used to post donation information messages.

Authentication:
Authentication is required for all endpoints.

Information Endpoint: /donation_statuses

Description: 
This resource is used to modify the donation information message status.

Authentication:
Authentication is required for all endpoints.

## REST API Method

* Method: ```POST/donations```

Post a donation message on public wall from a user

Response:
Status Code: ```200 OK```

Error code:
```500 Error Found```(for findallRecords function)
```400 Internal Connection Error```(for inserRecord function)

* Method:```GET/donations```

Get all the existing donation messages from the database

Response:
Status Code: ```200 OK```

Error code:
```500 Error Found```


* Method:```DELETE/donations```

Delete the assigned donation message posted by one citizen

Response:

Status Code: ```200 OK```
```400``` Do not delete

Error code:
```500 Error Found```

* Method:```PUT/donation_statuses```

Change the donation_status of the donation message posted by one citizen

Response:

Status Code: 
```200 OK```

Error code:
```500 Error Found```

### Pay Load
```
{
    username: string(required),
    resource: string(required),
    quantity: string(required),
    time_sent: string(required),
    sender_emg_status: string(required),
    location_info: string(optional),
    donation_status: string(required)
}
```


### Data Constraints
```
{
    "username": "valid username used to log in",
    "resource": "water",
    "resource_quantity": "1",
    "timestamp": "the time showing when a message was sent",
    "sender_emg_status": "Help, Emergency, OK",
    "sender_location": "location of the citizen",
    "donation_status": "available or reserved"
}
```
### Data Example
```
{
    "username": "Rayxie",
    "resource": "water",
    "resource_quantity": "5",
    "timesent": "2022-11-04 14:55:45",
    "sender_emg_status": "Help",
    "sender_location": "Mountain View",
    "donation_status": "available"
}
```