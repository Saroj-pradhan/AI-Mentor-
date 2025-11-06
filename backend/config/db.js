const mongoose = require("mongoose");
const connectDB = async ()=>{
    try{
   await mongoose.connect("mongodb+srv://saroj:saroj@saroj.nty39.mongodb.net/"  )
    console.log("connected with database sucessfully");
    }catch(error){
     console.log("error in connecting with database",error)
    }
}
module.exports = connectDB;