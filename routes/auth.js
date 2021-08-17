const express = require('express');
const router = express();
var nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const User = require("../models/User")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let { requireAuth } = require("../middlewares/userMiddleware");
var otpGenerator = require('otp-generator')
var sgMail = require('@sendgrid/mail')

const API_KEY =
"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"

sgMail.setApiKey(API_KEY)
const message = {
    to:"chiragjain55552@gmail.com",
    from:{
        name:'Chirag Jain',
        email:"chiragjain55551@gmail.com"
    },
    subject: "OTP Verifications",
    generateTextFromHTML: true,
    html: `Press <a href=${''} target="_blank" shape="rect"> here </a> to verify your email.Thanks`
};
// sgMail.send(message)
// .then((res)=>{
//     console.log('email sent')
// })
// .catch((err)=>{
//     console.log(err.message)
// })






const oauth2Client = new OAuth2(
    "395033379952-57fhpv4j4p3qt5agl4nom1780c80khgp.apps.googleusercontent.com",
    "NxaNI-apmrn6na0gO6lF57j9", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);




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

const sendOtp = (email,otp) => {

    var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'chiragjain55551@gmail.com',
          pass: 'Jayshree@123'
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
      });

  

    var mailOption,host,link;
    var sender= "chiragjain55551@gmail.com";
    
    
    mailOption = {
        from : sender,
        to : email,
        subject: "OTP Verifications",
        generateTextFromHTML: true,
        html: `YOUR OTP IS ${otp}`
    }

    smtpTransport.sendMail(mailOption, function(err, res){
        if(err) {
            res.status(500).send(err.message)
        } else {
            res.status(200).send("OTP HAS BEEN SENT TO YOUR REGISTERED EMAIL ID")
        }
    })

}

const sendEmail = (req,email,uniqueString) => {


    var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'chiragjain55551@gmail.com',
          pass: 'Jayshree@123'
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
        res.status(200).send({ token: token, isAdmin: user.isAdmin});
      } catch (err) {
        res.status(400).send(err.message);
      }
})


router.post("/forgot-password", async (req,res) => {
    const { sap_Id } = req.body
    const user = await User.findOne({sap_Id:sap_Id})
    
    if(user){
        var otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
        user.otp = otp;
        user.otpTimeLimit = Date.now();
        await user.save();
        console.log(user)
        sendOtp(user.email,otp)
        res.status(200).send({
            message:"OTP HAS BEEN SENT TO YOUR REGISTERED EMAIL ID",
            sap_Id:user.sap_Id
        })
        
    } else {
        res.status(500).send("User not found")
    }

    
})

router.post("/check-otp", async (req,res) => {
    const { sap_Id,otp } = req.body
    const user = await User.findOne({sap_Id:sap_Id})
    
    if(user){
         
        if(user.otp === otp){
            
            const millis = Date.now() - user.otpTimeLimit
            const seconds = Math.floor(millis / 1000)
            if(Number(seconds) < 120){
                user.otp = '';
                user.otpTimeLimit = Date.now();
                await user.save();
                res.status(200).send("You can go ahead and change password")
            } else {
                res.status(500).send("OTP got expired !")
            }
        } else {
            res.status(500).send("Invalid OTP")
        }
         
    }  else {
        res.status(500).send("User not found")
    }

    // if(email === user.email){

    //     var otp = generateOtp();
    //     user.otp = otp;
    //     user.otpTimeLimit = Date.now();
    //     await user.save()

    // } else {
    //     res.status(500).send("Invalid Email Address")
    // }
})


router.post("/change-password",async (req,res)=>{
    const { sap_Id, newPassword } = req.body
    const user = await User.findOne({sap_Id:sap_Id})
    
    if(user){
        const salt = await bcrypt.genSalt();
        const newpassword = await bcrypt.hash(newPassword, salt);
        user.password = newpassword
        await user.save();
        res.status(200).send("Password Changed Successfully !!")
    }  else {
        res.status(500).send("User not found")
    }

})

module.exports = router;