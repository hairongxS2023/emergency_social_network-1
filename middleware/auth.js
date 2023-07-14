import jwt from "jsonwebtoken";

export default class Auth {
  
  constructor(){}
  static genToken(payload, option=null){
    return new Promise((resolve, reject)=>{
      const secret = "FSES2023SB3HAKANYYDS";
      jwt.sign(payload, secret, option, (err, token)=>{
        if (err){
          console.log("generate token failed");
          reject(false);
        }else{
          resolve(token);
        }
      });
    });
  }
// auth.js file
 
  static verifyToken(req, res, next) {
    const secret = process.env.JWTSECRET;
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
          res.redirect('/');
        } else {
          //console.log("Username decode from JWT:" + decoded.username + "and authority: " + decoded.authority);
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

  static getUserFromToken(req) {
    const authHeader = req.headers.cookie;
    const token = authHeader.split("=")[1];
    const jwtSecret = process.env.JWTSECRET;
    try {
      const user = jwt.verify(token, jwtSecret);
      return user;
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }


};

