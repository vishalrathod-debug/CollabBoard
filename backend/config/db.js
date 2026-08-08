
const mongoose = require("mongoose");


const dbConnection= async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log("Connected to DB")
    }catch(err){
        console.log("ERROR During DB connection",err);
        process.exit();
    }


}
module.exports = dbConnection;