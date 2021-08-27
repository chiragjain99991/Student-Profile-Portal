require('dotenv').config()
const express = require("express");
var app = express();
let cookieParser = require("cookie-parser");
const Dbconnect = require('./database')
let cors = require("cors");
let dataRoute = require('./routes/data')
let authRoute = require("./routes/auth")

Dbconnect();


app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Your email is verified. You can go ahead with log in.Please")
})

app.use("/data",dataRoute);
app.use("/user",authRoute);

app.listen(process.env.PORT || 3000, () => {
    console.log("server started at 3000");
  });