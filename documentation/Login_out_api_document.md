# API Documentation for Login Logout
The Login and Logout functionality is performed to allow users enter their registered user name and password, the system will verify the correctness of user name and corresponding password hash as it was saved to the system while registered. If authentication is successful, the system will display all users based on their status along with alphabetical order.

### Associate Use Case
Login/Logout

# Login
### Open Endpoints
Login as exsiting user
* URL: ```/users/{userName}/online```
* Method: ```PUT```

### Request Data
```
{
    "username": "valid username used to register",
    "password": "associated account password"    
}
```
### Data Example
```
{
    "username": "Rayxie",
    "password": "abcd1234" 
}
```

## Success Status Code
Code: ```409 Conflict```
```
{
    "token": "H2kaCJjwjopKNNAqwerh31ASBxncam91aH2bAEWH12ajjAsaWBJ",
}
```
# Log out
## Fail Status Code

Code: if user not exist```404 NOT FOUND```

Code: if user's toke has expired ```500 Invalid Token```

### Open Endpoints
Log out
* URL: ```/localhost:PORT/users/offline```
* Method: ```PUT```

### Request Data
```
{
    "username": "username used to login",
}
```

### Data Example
```
{
    "username": "Rayxie",
}
```

## Success Status Code
Code: ```200 OK```
```
{
    "message": "Successfully log out",
}
```
## Fail Status Code
Code: ```400 Fail```
```
{
    "message": "Cannot find user name",
}
```
