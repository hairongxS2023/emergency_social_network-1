import Encryption from "../middleware/encrypt.js";
import MongooseClass from "../utils/database.js";
import citizen_model from "../models/citizens.js";
import Auth from "../middleware/auth.js";

class Login {
    static async verify(req, res, hashedPassword) {
      const passwordStr = req.body["password"];
      const result = await Encryption.checkPassword(passwordStr, hashedPassword);
      if (result) {
        // user entered correct password
        const payload = { username: req.body["username"]
                          //,authority:authority
                        };
        const option = { expiresIn: "1h" };
        Auth.genToken(payload, option).then((token)=>{
          return res.cookie("access_token", token, {
            expires: new Date(Date.now() + 3600000),
          })
          .status(200).json("loggin in");
        });
      } else {
        // user entered incorrect password
        return res.status(400).json("Wrong username/password combination");
      }
    }
    static async online(req, res) {
        const jsonString = Object.keys(req.body)[ 0 ];
        const username_here = jsonString;
        await MongooseClass.findAndUpdate(citizen_model,{ username: username_here },{ status: "online" });
        return res.status(200).json({message: "change the online status if the user gets online again."});
    }

}
export default Login;