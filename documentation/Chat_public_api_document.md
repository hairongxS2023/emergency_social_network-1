# API Documentation for Chat Publicly
Chat publicly function allows users to post their message at the community home page

## REST API Method

* Method: ```GET```   /publicChatPage
Render public chat room and,
Retrieve all messages posted on public wall

* Method: ```POST```  /messages/public/{userName}
Post a message on public wall from a user

* Method: ```GET```   /messages/public/{userName}
Retrieve all messages posted on public wall by a user (this is inactive for now until development of search function)

### Data Constraints
```
{
    "username": "valid username used to log in",
    "message": "the message a user intent to post publicly"
    "timestamp": "the time showing when a message was sent"
    "status": "user's status when sent the message"
}
```
### Data Example
```
{
    "username": "Rayxie",
    "message": "Good Morning" 
    "timestamp": "2022-11-04 14:55:45"
    "status": "Emergency"
}
```

## Success Response
Code: ```200 OK```


## Error Response
Code: ```404 NOT FOUND```
e.g. Message related to specfic username not found

Code: ```400 BAD REQUEST```
e.g. Posting message fail

Code: ``` 500 INTERNAL SERVER ERROR```
