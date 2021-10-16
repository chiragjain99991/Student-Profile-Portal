// var sgMail = require('@sendgrid/mail');
// const API_KEY1 = "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" ;
// sgMail.setApiKey(API_KEY1) ;
var nodemailer = require("nodemailer");

module.exports =  (req,email,password,sap_Id,uniqueString) => {

    var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'djsceItDepartment@gmail.com',
          pass: 'xtccwrwvzssxbewo'
        }
      });

  

    var mailOption,host,link;
    var sender= "djsceItDepartment@gmail.com";

    mailOption = {
        from : sender,
        to : email,
        subject: "Email Verification for profile portal made by IT Department of DJ Sanghvi",
        generateTextFromHTML: true,
        html: `<p style="font-size: 20px;" >Your registered Sap Id is: <b>${sap_Id}</b></p><p style="font-size: 20px;">Your password is: <b>${password}</b></p>`
    };

    smtpTransport.sendMail(mailOption, function(err, response){
        if(err) {
            console.log(err)
        } else {
            console.log("email sent")
        }
    })


   
    // const message = {
    //     from:{
    //         name:'Chirag Jain',
    //         email:"chiragjain55551@gmail.com"
    //     },
    //     to : email,
    //     subject: "Email Verification for profile portal made by IT Department of DJ Sanghvi",
    //     generateTextFromHTML: true,
    //     html: `<p style="font-size: 20px;" >Your registered Sap Id is: <b>${sap_Id}</b></p><p style="font-size: 20px;">Your password is: <b>${password}</b></p>`
    // };
    // sgMail.send(message)
    // .then((res)=>{
    //     console.log('email sent')
    // })
    // .catch((err)=>{
    //     return res.status(500).send({msg:err.message});
    // })


}