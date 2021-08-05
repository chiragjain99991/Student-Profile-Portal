const express = require('express');
const router = express();
var nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const User = require("../models/User")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const oauth2Client = new OAuth2(
    "395033379952-57fhpv4j4p3qt5agl4nom1780c80khgp.apps.googleusercontent.com",
    "NxaNI-apmrn6na0gO6lF57j9", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: "1//04LNCj3Zi791OCgYIARAAGAQSNwF-L9Ir1X1rRCzlqI64Q_kJgOJOroYjZeh53KW997zD7OEa5x3rYqC75yPgIxHdlOq2ehIG6qI"
});
const accessToken = oauth2Client.getAccessToken()

const generateString=()=>{
    const len = 8
    let randStr = ''
    for(let i=0;i<len;i++){
        const ch = Math.floor((Math.random()*10)+1)
        randStr += ch
    }
    return randStr;
}

const maxAge = 3 * 24 * 60 * 60;

const createToken = (Id) => {
    return jwt.sign({Id},"profile portal project",{
        expiresIn: maxAge,
      });
}

const sendEmail = (req,email,uniqueString) => {
    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
             type: "OAuth2",
             user: "chiragjain55551@gmail.com", 
             clientId: "395033379952-57fhpv4j4p3qt5agl4nom1780c80khgp.apps.googleusercontent.com",
             clientSecret: "NxaNI-apmrn6na0gO6lF57j9",
             refreshToken: "1//04LNCj3Zi791OCgYIARAAGAQSNwF-L9Ir1X1rRCzlqI64Q_kJgOJOroYjZeh53KW997zD7OEa5x3rYqC75yPgIxHdlOq2ehIG6qI",
             accessToken: accessToken
        },
        tls: {
            rejectUnauthorized: false
          }
    });
    var mailOption,host,link;
    var sender= "chiragjain55551@gmail.com";
    host=req.get('host');
    link="https://profiledataform.herokuapp.com/user/verify/"+uniqueString;
    mailOption = {
        from : sender,
        to : email,
        subject: "Email Verifications",
        generateTextFromHTML: true,
        html: `Press <a href=${link} target="_blank" shape="rect"> here </a> to verify your email.Thanks`
    }

    smtpTransport.sendMail(mailOption, function(err, res){
        if(err) {
            console.log(err)
        } else {
            res.status(200).send("Email Sent")
        }
    })
}



router.post("/register",async(req,res)=>{
  
    const {email,password,sap_Id} = req.body;
    User.findOne({ sap_Id: req.body.sap_Id }, async function (err, user) {
        // error occur
        if(err){
            return res.status(500).send({msg: err.message});
        }
        // if email is exist into database i.e. email is associated with another user.
        else if (user) {

            if(user.isValid){
                return res.status(400).send({msg:'This sap id is already associated with another account.'});
            }else{
                await User.findOneAndDelete({sap_Id});
                const uniqueString = generateString();
                const isValid = false;
                const salt = await bcrypt.genSalt();
                const newPassword = await bcrypt.hash(password, salt);
                const newUser = new User({uniqueString, email,isValid,password:newPassword,sap_Id});
                await newUser.save();
                // console.log(newUser)
                sendEmail(req,email,uniqueString);
                return res.status(200).send({msg:'Verify the email account through mail sent on registered email.'});
            }



            
        }
        // if user is not exist into database then save the user into database for register account
        else{

            const uniqueString = generateString();
            const isValid = false;
            const salt = await bcrypt.genSalt();
            const newPassword = await bcrypt.hash(password, salt);
            const newUser = new User({uniqueString, email,isValid,password:newPassword,sap_Id});
            await newUser.save();
            // console.log(newUser)
            sendEmail(req,email,uniqueString);
            return res.status(200).send({msg:'Verify the email account through mail sent on registered email.'});


        }
    })

})

router.get("/verify/:uniqueString",async (req,res)=>{
    const { uniqueString } = req.params;
    const user = await User.findOne({uniqueString:uniqueString})
    if(user){       
        user.isValid = true;
        await user.save();
        res.redirect('/')
    } else {
        console.log("user not found")
    }
})


router.post("/login",async (req,res) => {
    try{
        const { password, sap_Id } = req.body;
        const user = await User.login(sap_Id, password);
        const token = createToken(user._id);
        res.status(200).send({ token: token });
      } catch (err) {
        res.status(400).send(err.message);
      }
})

module.exports = router;