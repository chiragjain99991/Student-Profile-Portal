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
        subject: "OTP Verification for changing password of your account on student profile portal made by Information Technology Department of Dwarkadas J. Sanghvi College of Engineering",
        generateTextFromHTML: true,
        html: `<p style="font-size: 23px;"><b>DJSCE-INFORMATION TECHNOLOGY</b></p> </br><p style="font-size: 23px;"><b>STUDENT PROFILE PORTAL</b></p> </br> <p style="font-size: 20px;" >YOUR OTP IS <b>${otp}<b></p>`
    }

    smtpTransport.sendMail(mailOption, function(err, response){
        if(err) {
            console.log(err)
        } else {
            console.log("email sent")
        }
    })

}