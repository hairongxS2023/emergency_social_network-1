// This is the database class contain functions of database operation
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const MAX_RETRIES = 3;
const NORMAL_DB = process.env.MONGODB_URL_NORMAL;
const TEST_DB = process.env.MONGODB_URL_TEST;
const LOCAL_DB = process.env.MONGODB_URL_LOCAL;
export default class MongooseClass
{ 
  static async initDB(mongoUri = NORMAL_DB) {
    this.connectDB(mongoUri);
  }
  static async connectTestDB(mongoUri = TEST_DB) {
    this.connectDB(mongoUri);
  }

  static async connectLocalDB(mongoUri = LOCAL_DB) {
    this.connectDB(mongoUri);
  }

  static async connectDB(dbname) {
    const connectionString = dbname;
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Add a server selection timeout
    };
  
    const maxRetries = MAX_RETRIES;
    let retries = 0;
  
    mongoose.set("strictQuery", false);
  
    return new Promise(async (resolve, reject) => {
      while (retries < maxRetries) {
        try {
          // Set up event listeners before attempting to connect
          mongoose.connection.once('connected', () => {
            console.log('In connectDB, Connected to: ', mongoose.connection.name);
            resolve();
          });
          mongoose.connection.once('error', (err) => {
            console.error('Mongoose connection error:', err);
          });
          mongoose.connection.once('disconnected', () => {
            console.log('Mongoose connection disconnected');
          });
          mongoose.connection.once('reconnected', () => {
            console.log('Mongoose connection reconnected');
          });
          await mongoose.connect(connectionString, connectionOptions);
          // If connected successfully, break the loop
          break;
        } catch (err) {
          retries++;
          console.log(`In connectDB, Connection attempt ${retries} failed. Retrying...`);
  
          if (retries === maxRetries) {
            reject(new Error('in connectDB, Connection to MongoDB failed after maximum retries'));
          }
        }
      }
    });
  }

  // close database connection
  static async closeDB() {
    return new Promise((resolve, reject) => {
      // Set up a timer to timeout after 10 seconds
      const timeout = setTimeout(() => {
        reject(new Error('in closeDB, Connection to MongoDB timed out'));
      }, 10000);
      mongoose.connection.close().then(() => {
        clearTimeout(timeout);
        console.log("database closed");
        resolve();
      });
    });
  }

  static async switch_to_test_DB() {
    return new Promise((resolve, reject) => {
      if (mongoose.connection.name === "normal" && mongoose.connection.readyState === 1) {
        // There are no pending operations, it's safe to close the connection
        mongoose.connection.close().then(() => {
          const timeout = setTimeout(() => {
            reject(new Error('in switch_to_test_DB Connection to MongoDB timed out'));
          }, 10000);
          mongoose.set("strictQuery", false);
          console.log("testdb",'mongodb+srv://chuanxiz:zhangzcx1999@cluster0.g8kp7ft.mongodb.net/test');
          // Create a new Mongoose connection
          mongoose.connect('mongodb+srv://chuanxiz:zhangzcx1999@cluster0.g8kp7ft.mongodb.net/test',{ useNewUrlParser: true, useUnifiedTopology: true }
          );
          // Handle connection events
          mongoose.connection.once('error', (err) => {
            clearTimeout(timeout);
            reject(err); 
          });
          mongoose.connection.once('connected', () => {
            clearTimeout(timeout);
            console.log('In switch_to_test_DB, switch to: ', mongoose.connection.name);
            resolve();
          });//end of connected
        }); //end of then
      }
    });//end of promise
  }//end of switch_to_test_DB

  static async stop_test_DB() {
    return new Promise((resolve, reject) => {
      //console.log("In stop_test_DB, now Connecting to: ", mongoose.connection.name);
      if (mongoose.connection.readyState === 1) {
        // There are no pending operations, it's safe to close the connection
        mongoose.connection.close().then(() => {
          console.log(mongoose.connection.name, " database closed");
          // Set up a timer to timeout after 10 seconds
          const timeout = setTimeout(() => {
            reject(new Error('in Stop_test_DB, Connection to MongoDB timed out'));
          }, 10000);

          // Create a new Mongoose connection
          mongoose.connect(
            process.env.MONGODB_URL_NORMAL,
            { useNewUrlParser: true, useUnifiedTopology: true }
          );
          // Handle connection events
          mongoose.connection.once('error', (err) => { 
            clearTimeout(timeout);
            reject(err);
          });
          mongoose.connection.once('connected', () => {
            clearTimeout(timeout);
            console.log('In stop_test_DB, switch to: ', mongoose.connection.name);
            resolve();
          });//end of connected
        });//end of close;
      } else {
        // There are pending operations, wait for them to finish before closing the connection
        mongoose.connection.once('connected', () => {
          mongoose.connection.close((err) => {
            if (err) {
              reject(err);
            } else {
              console.log("test database closed");
              resolve("test database closed");
            }//end of else
          }).then(() => { 
            console.log(mongoose.connection.name, " database closed");
            // Set up a timer to timeout after 10 seconds
            const timeout = setTimeout(() => {
              reject(new Error('in Stop_test_DB, Connection to MongoDB timed out'));
            }, 10000);

            // Create a new Mongoose connection
            mongoose.connect(
              process.env.MONGODB_URL_NORMAL,
              { useNewUrlParser: true, useUnifiedTopology: true }
            );
            // Handle connection events
            mongoose.connection.once('error', (err) => {
              clearTimeout(timeout);
              reject(err);
            });
            mongoose.connection.once('connected', () => {
              clearTimeout(timeout);
              console.log('In stop_test_DB, resorve to: ', mongoose.connection.name);
              resolve();
            });//end of connected
          });//end of close
        });// end of connected
      }//end of else
    });//end of promise
  }//end of stop_test_DB

  static async delete_DB() {
    //console.log("in delete_DB, DB NAME: ", mongoose.connection.name);
    return new Promise((resolve, reject) => {
      mongoose.connection.collection("public_channel_msgs").deleteMany((err, result) => {
        if (err) {
          console.log("Error dropping database: ", err);
          reject(err);
        } else {
          mongoose.connection.collection("public_channel_msgs").countDocuments((err, count) => {
            if (err) {
              console.log("Error counting documents: ", err);
              reject(err);
            } else if (count === 0) {
              console.log("--------------TEST FINISHED---------------");
              console.log("All documents in public_channel_msgs have been deleted.");
              resolve("All documents in public_channel_msgs have been deleted.");
            } else {
              console.log(`Error: ${count} documents still remain in public_channel_msgs.`);
              reject(new Error(`Error: ${count} documents still remain in public_channel_msgs.`));
            }
          });
        }
      });
    });
  } 


static async findAllRecords(model, query = null, sortQuery = null, limit = null) {
  //console.log(query);
  if (mongoose.connection.readyState === 0) {
    console.log("Fail to find all records, Database is disconnected.");
    return;
  }

  return new Promise((resolve, reject) => {
    let findQuery = model.find();
    if (query) {
      findQuery = findQuery.find(query);
    }
    if (sortQuery) 
    {
      findQuery = findQuery.sort(sortQuery).sort({ _id: -1 });
    }
    if (limit) {
      if (limit > 1) {
        findQuery = findQuery.limit(limit);
      }
    }
    findQuery.exec(function (err, docs) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        //console.log("read from database success");
        resolve(docs);
      }
    });
  });
}

  static async findAndUpdate(model, require_query, update_query) {
    if (mongoose.connection.readyState === 0) {
      console.log("Fail to find and update, database is disconnected.");
      return
    }
    return new Promise( ( resolve, reject ) =>
    {
      model.findOneAndUpdate( require_query, update_query, function ( err, docs )
      {
        if ( err )
        {
          reject( err );
        }
        else
        {
          console.log(docs);

          resolve( docs );
        }
      } );
    } );
  }
 
  static async insertRecord(model) {
    if (mongoose.connection.readyState === 0) {
      console.log("Fail to insert, database is disconnected.");
      return
    }

    return new Promise((resolve, reject) => {
      model.save((err, result) => {
        if (err) {
          reject( err );
        }
        else
        {
          console.log( "model saved successfully" );
          resolve( result );
        }
      } );
    } );
  }

/*Usage:
To delete a specific record: deleteRecord(model, query)
To delete all records: deleteRecord(model)
To delete records by user: deleteRecord(model, query, true)
To delete one record: deleteRecord(model, query, false, true)
To find an item by ID and delete: deleteRecord(model, id, false, false, true)*/
  static async deleteRecord(model, query = null, byUser = false, deleteOne = false, byId = false) {
    if (mongoose.connection.readyState === 0) {
      console.log("Fail to find all records, Database is disconnected.");
      return;
    }
  
    return new Promise(async (resolve, reject) => {
      let deleteQuery = query;
  
      if (byUser && query !== null) {
        deleteQuery = {username: query};
      } else if (byId && query !== null) {
        deleteQuery = {_id: query};
      }
  
      let deleteFunction;
      if (byId) {
        deleteFunction = model.findOneAndDelete;
      } else {
        deleteFunction = deleteOne ? model.deleteOne : model.deleteMany;
      }
  
      deleteFunction.call(model, deleteQuery, function (err, result) {
        if (err) {
          console.log("Error deleting in database" + err);
          reject(err);
        } else {
          console.log("delete success");
          resolve(result);
        }
      });
    });
  }

  static async findRespectiveRecords(model, type, query = null, count = null) {
    if (mongoose.connection.readyState === 0) {
      console.log("Fail to find all records, Database is disconnected.");
      return;
    }
    return new Promise((resolve, reject) => {
      let searchQuery;
      switch (type) {
        case 'username':
          searchQuery = query ? {username: {$regex: query, $options: 'i'}} : {};
          break;
        case 'status':
          searchQuery = query ? {emergency_status: {$regex: query, $options: 'i'}} : {};
          break;
        case 'announcement':
          searchQuery = query ? {'announcement_content': {$regex: query, $options: 'i'}} : {};
          break;
        default:
          reject(new Error('Invalid type parameter'));
          return;
      }
      let queryBuilder = model.find(searchQuery);
      if (type === 'announcement' && count !== null) {
        queryBuilder = queryBuilder.sort({timesent: -1}).limit(count);
      }
      queryBuilder.exec((err, docs) => {
        if (err) {
          console.log("error", err);
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }
};
