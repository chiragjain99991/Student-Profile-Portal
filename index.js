require('dotenv').config()
const express = require("express");
var app = express();
let cookieParser = require("cookie-parser");
const Dbconnect = require('./database')
let cors = require("cors");

let authRoute = require("./routes/auth")
let userRoute = require("./routes/user")

Dbconnect();


app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Your email is verified. You can go ahead with log in.Please")
})


app.use("/user",authRoute);
app.use("/data",userRoute)

app.listen(process.env.PORT || 8800, () => {
    console.log("server started at 5500");
  });