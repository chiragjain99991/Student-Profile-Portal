var nodemailer = require("nodemailer");
module.exports  = (email,otp) => {

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
        subject: "OTP Verifications",
        generateTextFromHTML: true,
        html: `YOUR OTP IS ${otp}`
    }

    smtpTransport.sendMail(mailOption, function(err, response){
        if(err) {
            console.log(err)
        } else {
            console.log("email sent")
        }
    })

}