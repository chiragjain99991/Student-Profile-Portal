var nodemailer = require("nodemailer");
module.exports  = (email,otp) => {

    var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'chiragjain55551@gmail.com',
          pass: 'Jayshree@123'
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
            return res.status(500).send({msg:err.message});
        } else {
            res.status(200).send("OTP HAS BEEN SENT TO YOUR REGISTERED EMAIL ID")
        }
    })

}