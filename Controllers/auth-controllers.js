const User = require('../models/User')
const bcrypt = require("bcrypt");
const generateString  = require('../Services/generateString');
const sendEmail = require("../Services/sendEmail")
const createToken = require("../Services/createToken")
var generatePassword = require('password-generator');


class AuthController{
    async register(req,res){

        
        if(req.body.data.length !== 1){

            let alreadyexist = []
            let userCreated=[]


            var data = await Promise.all(req.body.data.map((data)=>{
                const { email, sap_Id, year_join, year_passed } = data; 
                const password=generatePassword(12, false)
                return User.findOne({ sap_Id:  sap_Id }, async function (err, user) {
                    // error occur
                    if(err){
                        return res.status(500).send({msg: err.message});
                    }
                    // if email is exist into database i.e. email is associated with another user.
                    else if (user) {
            
                        if(user.isValid){
                           
                            return {sap_Id:"already exists"}
                            // console.log('jsj',alreadyexist)
                            // return res.status(400).send({msg:'This sap id is already associated with another account.'});
                        }
                        else{
                            await User.findOneAndDelete({sap_Id});
                            const uniqueString = generateString();
                            const isValid = false;
                            const salt = await bcrypt.genSalt();
                            const newPassword = await bcrypt.hash(password, salt);
                            const newUser = new User({ uniqueString, email, isValid, password:newPassword, sap_Id, year_join, year_passed });
                            await newUser.save();
                            sendEmail(req,email,password,sap_Id,uniqueString);
                            userCreated.push(sap_Id)
                            return newUser
                        }               
                    }
                    // if user is not exist into database then save the user into database for register account
                    else{
            
                        const uniqueString = generateString();
                        const isValid = false;
                        const salt = await bcrypt.genSalt();
                        const newPassword = await bcrypt.hash(password, salt);
                        const newUser = new User({uniqueString, email, isValid, password:newPassword, sap_Id, year_join, year_passed});
                        await newUser.save();
                        sendEmail(req,email,password,sap_Id,uniqueString);
                        userCreated.push(sap_Id)
                        return newUser
                    }

                    

                   
                })

                
                
            }))
            const result = []
            for(let user of data){
                if(user && user.isValid){
                    const sapId= user.sap_Id
                    result.push(sapId)
                }
            }

            console.log("data",result)
            return res.status(200).send({msg:'Users Created',existedUser:result}); 
           
        }else{

            const { email, password, sap_Id, year_join, year_passed } = req.body.data[0];
            User.findOne({ sap_Id:  sap_Id }, async function (err, user) {
                // error occur
                if(err){
                    return res.status(500).send({msg: err.message});
                }
                // if email is exist into database i.e. email is associated with another user.
                else if (user) {
        
                    if(user.isValid){
                        return res.status(400).send({msg:'This sap id is already associated with another account.'});
                    }
                    else{
                        await User.findOneAndDelete({sap_Id});
                        const uniqueString = generateString();
                        const isValid = false;
                        const salt = await bcrypt.genSalt();
                        const newPassword = await bcrypt.hash(password, salt);
                        const newUser = new User({ uniqueString, email, isValid, password:newPassword, sap_Id, year_join, year_passed });
                        await newUser.save();
                        sendEmail(req,email,password,sap_Id,uniqueString);
                        return res.status(200).send({msg:'Verify the email account through mail sent on registered email.'});
                    }               
                }
                // if user is not exist into database then save the user into database for register account
                else{
        
                    const uniqueString = generateString();
                    const isValid = false;
                    const salt = await bcrypt.genSalt();
                    const newPassword = await bcrypt.hash(password, salt);
                    const newUser = new User({uniqueString, email, isValid, password:newPassword, sap_Id, year_join, year_passed});
                    await newUser.save();
                    sendEmail(req,email,password,sap_Id,uniqueString);
                    return res.status(200).send({msg:'Verify the email account through mail sent on registered email.'}); 
                }
            })  
    }

    }
    async login(req,res){
        try{
            const { password, sap_Id } = req.body;
            const user = await User.login(sap_Id, password);
            const token = createToken(user._id);
            if(!user.isValid){
                user.isValid = true;
                await user.save();
            }
            res.status(200).send({ token: token, isAdmin: user.isAdmin});
          } catch (err) {
            return res.status(500).send({msg:err.message});
          }
    }
    async isAdmin(req,res){
        if(req.user.isAdmin){
            return res.status(200).send({isAdmin:true});
        }else{
            return res.status(200).send({isAdmin:false});
        }
    }
    async verifymail(req,res){
        const { uniqueString } = req.params;
        const user = await User.findOne({uniqueString:uniqueString})
        if(user){       
            user.isValid = true;
            await user.save();
            res.redirect('/')
        } else {
            return res.status(200).send({msg:'Verify the email account through mail sent on registered email.'});
        }
    }
}

module.exports = new AuthController();