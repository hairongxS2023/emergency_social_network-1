import dotenv from "dotenv";
dotenv.config();
module.exports = {
  MONGODB_URL_LOCAL: process.env.MONGODB_URL_LOCAL,
  MONGODB_URL_remote: process.env.MONGODB_URL_remote,
  PORT: process.env.PORT,
};
