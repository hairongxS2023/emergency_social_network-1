import MongooseClass from "../utils/database.js";
export default class Speed_test{
    static async init(req,res){
        return new Promise((resolve, reject)=>{
            MongooseClass.switch_to_test_DB().then((result)=>{
                 resolve("Done init test_DB in speed controller");
            });
         })
    }

    static async stop(req,res){
        try{
            await MongooseClass.delete_DB();
            await MongooseClass.stop_test_DB();
            return "Done stop test_DB in speed controller";
        }catch(err){
            console.log(err);
        }
    }
}