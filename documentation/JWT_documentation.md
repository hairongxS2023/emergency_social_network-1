# JWT documentation

## function generating token: ./middleware/auth.js
```
static genToken(payload, option=null){
    return new Promise((resolve, reject)=>{
      const secret = "FSES2023SB3HAKANYYDS";
      jwt.sign(payload, secret, option, (err, token)=>{
        if (err){
          console.log("generate token failed", err);
          reject(false);
        }else{
          resolve(token);
        }
      });
    });
  }
```
### Verifying token: ./middleware/auth.js
 ```
 static verifyToken(req, res, next) {
    const secret = "FSES2023SB3HAKANYYDS";
    //const token = req.headers.authorization?.split(' ')[1];
    let token;
    //avoid no cookie error
    if (req.headers.cookie){
      const cookies = req.headers.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0].trim() === "access_token") {
          //console.log("in auth.js Cookie: ",cookie);
          token=cookie[1];
        }
      }
      if (!token) {
        res.redirect('/');
      }
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          console.error(err);
          res.redirect('/');
        } else {
          console.log("Username decode from JWT:" + decoded.username + "and authority: " + decoded.authority);
          req.username = decoded.username; // Set the decoded userId to req object
          req.authority = decoded.authority;
          next();
        }
      });
    }
    else{
      res.redirect('/');
    }
  }
  ```

## How to use these method:
``` static genToken(payload, option=null) ```
Right now genToken is used at registerring user and log in, payload should be form of JSON
e.g.  const payload = { username: username, authority: authority};
username and authority are two fields required now, additional fields may need for further identification purposes

``` static verifyToken(req, res, next) ```
Request parameter contains the cookie that needs to be verified, and information in token can be retrived by ``` const cookies = req.headers.cookie.split(";") ``` 
Refer function of verifyToken above for usage
Whenever an invalid get request happen, system will redirect to homepage

## Example

``` 
const token = Cookies.get('access_token');
const decodedToken = JSON.parse(atob(token.split('.')[1]))
const username = decodedToken.username;
console.log("username", username);

```