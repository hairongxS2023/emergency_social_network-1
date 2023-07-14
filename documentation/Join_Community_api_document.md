# API Documentation for Join Community
Join Community - The use case allows the Citizen to join the community by providing a new username and password. The Citizen is added to the ESN directory. A welcome message is displayed.
​
### Associate Use Case
JoinCommunity Login/Logout 
​
### Open Endpoints
Login as exsiting user
* URL: ```/localhost:PORT/users/:username```
* Method: ```POST```

### Request Data
```
{
    "username": "Rayxie",
    "password": "abcd1234" 
}
```
​
## Response Data


## ​Success Status Code
*Code: ```201 CREATED```, if user is created successfully

## Fail Status Code
* Code: ```400 BAD REQUEST``` if the password or username is not satisfactory/is not a POST request

* Code: ```409 CONFLICT``` target resource conflict, ask user to login
