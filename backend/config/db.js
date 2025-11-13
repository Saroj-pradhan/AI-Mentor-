const mongoose = require("mongoose");
const connectDB = async ()=>{
    try{
   await mongoose.connect(process.env.MONGO_URL)
    console.log("connected with database sucessfully");
    }catch(error){
     console.log("error in connecting with database",error)
    }
}
module.exports = connectDB;