# API Documentation for Chat privately
Chat privately function allows users to post their message at the community home page

## REST API Method

* Method: ```GET```   /privateChatPage
### Data Constraints
```
{
    "receiver": "valid username used to log in",
    "status": "user's status when entering the char room"
}
```
### Data Example
```
{
    "receiver": "Rayxie",
    "status": "undefined"
}
```

## Success Response
Code: ```200 OK```

## Error Response
Code: ```403 FORBIDDEN```
e.g. User try to access a private chat room that does not belong to this user

Code: ``` 500 INTERNAL SERVER ERROR```
* Method: ```POST```  /messages/private/
* Post a message on private wall from a user to another user
### Data Constraints
```
{
    "receiver": "valid username used to log in",
    "message": "the message a user intent to post privately"
    "status": "user's status when sent the message"
    "level": "administrator or citizen"
}
```
### Data Example
```
{
    "receiver": "Rayxie",
    "message": "Good Morning" 
    "status": "Emergency"
    "level":"administrator"
}
```

## Success Response
Code: ```200 OK```

## Error Response
Code: ```403 FORBIDDEN```
e.g. User try to access a private chat room that does not belong to this user


Code: ```400 BAD REQUEST```
e.g. Posting message fail

Code: ``` 500 INTERNAL SERVER ERROR```

* Method: ```GET```   /messages/private/
* Retrieve all messages posted on private wall by a users (this is inactive for now until development of search function)
* ```
* payload:{
*   sender:"username",
*   receiver:"username"
* }

example:{
    sender:"jason",
    receiver:"harris"
 }
* ```

## Success Response
Code: ```200 OK```
```
{
message:[
       {
        Sender: "RayXie",
        Sender Status:"Emergency",
        Reciever: "JasonZhang",
        Reciever Status:"Emergency",
        time: "2022-11-04 14:55:55",
        Message: "Hello Jason, I am Ray"
       },
       {
        Sender: "JasonZhang",
        Sender Status:"Emergency",
        Reciever: "RayXie",
        Reciever Status:"Emergency",
        time: "2022-11-04 14:56:35",
        Message: "Hello Ray, I need help!"}
        ]
}
```

## Error Response


Code: ```400 BAD REQUEST```
e.g. Posting message fail

Code: ```403 FORBIDDEN```
e.g. User try to access a private chat room that does not belong to this user

Code: ```404 NOT FOUND```
e.g. Message related to specfic username not found

Code: ``` 500 INTERNAL SERVER ERROR```
