import bcrypt from "bcryptjs";

class Encryption {

  static async encrypt(password) {
    return new Promise((resolve, reject) => {
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  }

  static async checkPassword(passwordStr, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(passwordStr, hashedPassword).then(function(result){
        //console.log("in encrypt Bycrypt resuld:", result); // "Some User token"
        if (result) {
          console.log("right password");
          resolve(true);
        }else{
          console.log("wrong password");
          resolve(false);
        }
      });
    });
  }
};


export default Encryption;
