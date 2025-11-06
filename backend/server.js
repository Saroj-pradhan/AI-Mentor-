const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const app = express();
app.use(express.json());
connectDB();
const port = process.env.PORT|| 5000;
app.get("/",(res,rej)=>{
  return  rej.send("hii it working");
})
app.listen(port,()=>{
    console.log(`server runned sucessfully on port no ${port} `)
})
