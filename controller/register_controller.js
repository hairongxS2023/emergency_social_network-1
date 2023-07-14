import getReserved from "../utils/reserve_words.js";
import citizen_model from "../models/citizens.js";
import notification_model from "../models/notification.js";
import Encryption from "../middleware/encrypt.js";
import Login from "../controller/login_controller.js";
import Auth from "../middleware/auth.js";
import MongooseClass from "../utils/database.js"

// Define the strategy interface for strategy pattern
class ValidationStrategy {
  execute(username, password) { }
}

// Define a strategy for validating username length
class UsernameLengthStrategy extends ValidationStrategy {
  execute(username, password) {
    if (username.length < 3) {
      return {
        statusCode: 400,
        message:
          "Username cannot be shorter than 3 characters" +
          "<br> Please enter a longer username",
      };
    } else {
      return "success";
    }
  }
}

// Define a strategy for validating password length
class PasswordLengthStrategy extends ValidationStrategy {
  execute(username, password) {
    if (password.length < 4) {
      return {
        statusCode: 400,
        message:
          "Password length must be greater than 4" + "<br> Please edit your password",
      };
    } else {
      return "success";
    }
  }
}

// Define a strategy for validating username against reserved words
class ReserveWordsStrategy extends ValidationStrategy {

  execute(username, password) {
    const reservedWords = getReserved();
    if (reservedWords.includes(username)) {
      return {
        statusCode: 400,
        message:
          "Your username contains a reserved word" +
          "<br> Please revise your username",
      };
    } else {
      return "success";
    }
  }
}

// Define the validator class
class Validator {
  constructor (strategies) {
    this.strategies = strategies;
  }

  validate(username, password) {
    for (const strategy of this.strategies) {
      const result = strategy.execute(username, password);
      if (result !== "success") {
        return result;
      }
    }
    return "success";
  }
}


class Register {

  // use the strategy pattern to validate username and password
  static username_password_validation(username, password) {
    const validator = new Validator([
      new UsernameLengthStrategy(),
      new PasswordLengthStrategy(),
      new ReserveWordsStrategy(),
    ]);

    const result = validator.validate(username, password);
    console.log(result);
    return result;
  }

  static async create_user(req,res) {
    const hash = await Encryption.encrypt(req.body.password);
    try {
      const user = new citizen_model({
        username: req.body.username,
        password: hash,
        status: "online",
        emergency_status: "undefined",
        authority: "citizen"
      });
      const user_notification = new notification_model({
        username: req.body.username,
      });
      await MongooseClass.insertRecord(user);
      await MongooseClass.insertRecord(user_notification);
      return { statusCode: 201, message: "Create Success" };
    }
    catch (error) {
      return { statusCode: 500, message: "Server Create Failed" };
    }
  };

  static async register(req,res) {
      if(!req.body.username || !req.body.password) {
        return res.status(400).json( "Please enter valid username and password" );
      }
      let respondJson;
      respondJson = this.username_password_validation(req.body.username, req.body.password);
      if (respondJson != "success") {
         return res.status(respondJson[ "statusCode" ]).json(respondJson[ "message" ]);

      }
      try {
        //if username exists
        const result = await MongooseClass.findAllRecords(citizen_model, { username: req.body.username });
        if (result.length > 0) {
          //user name already exist, check password
          const u_name_db = result[ 0 ][ "username" ];
          const u_pwd_db = result[ 0 ][ "password" ];
          const curr_status = result[ 0 ][ "account_status" ];
          console.log("this is u_name_db: " + u_name_db+"and this is status: "+curr_status);
          if(curr_status=='inactive'){
            console.log("inactive account");
            return res.status(403).json({ message: "Account is inactive, please contact admin" });
          }
          //console.log("this shouldn't lshow");

          // const authority = result[0]["authority"];
          await Login.verify(req,res, u_pwd_db);
        }
        else {
          //register for this 
          respondJson = await this.create_user(req,res)
          const payload = { username: req.body.username };
          const option = { expiresIn: "1h" };
          Auth.genToken(payload, option).then((token) => {
            return res.status(201)
              .cookie("access_token", token, {
                expires: new Date(Date.now() + 3600000)
              }).json({ message: respondJson })
          });
        }
      }catch (error) {
        return res.status(500).json({ message: 'Internal Server Error'});
      }
  }
}

export default Register;
