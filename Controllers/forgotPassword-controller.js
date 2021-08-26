const User = require("../models/User")
const bcrypt = require("bcrypt");
var otpGenerator = require('otp-generator')
const sendOtp = require("../Services/sendOtp")

class ForgotPasswordController{
    async checkSapId(req,res){
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
            return res.status(500).send({msg:'User not found'});
        }
    
    }
    async checkOtp(req,res){
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
                    return res.status(500).send({msg:"OTP got expired !"})
                }
            } else {
                return res.status(500).send({msg:"Invalid OTP"})
            }
             
        }  else {
            return res.status(500).send({msg:'User not found'});
        }
    }
    async changePassword(req,res){
        const { sap_Id, newPassword } = req.body
        const user = await User.findOne({sap_Id:sap_Id})
        
        if(user){
            const salt = await bcrypt.genSalt();
            const newpassword = await bcrypt.hash(newPassword, salt);
            user.password = newpassword
            await user.save();
            res.status(200).send("Password Changed Successfully !!")
        }  else {
            return res.status(500).send({msg:'User not found'});
        }
        
    }

}

module.exports = new ForgotPasswordController()