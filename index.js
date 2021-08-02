const express = require("express");
var app = express();
let cookieParser = require("cookie-parser");
let cors = require("cors");
let mongoose = require("mongoose");
let dataRoute = require('./routes/Data')
let authRoute = require("./routes/auth")


mongoose.connect(
    "mongodb+srv://chiragjain:Chirag123@profileform.7i853.mongodb.net/ProfileForm?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => {
      console.log("database started");
    }
);

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("hello welcome")
})

app.use("/data",dataRoute);
app.use("/user",authRoute);

app.listen(process.env.PORT || 3000, () => {
    console.log("server started at 3000");
  });