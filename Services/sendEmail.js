var sgMail = require('@sendgrid/mail')
const API_KEY = process.env.SG_MAIL_API_KEY
sgMail.setApiKey(API_KEY)

module.exports =  (req,email,uniqueString) => {


    var link="https://profiledataform.herokuapp.com/user/verify/"+uniqueString;
    const message = {
        from:{
            name:'Chirag Jain',
            email:"chiragjain55551@gmail.com"
        },
        to : email,
        subject: "Email Verification for profile portal made by IT Department of DJ Sanghvi",
        generateTextFromHTML: true,
        html: `Press <a href=${link} target="_blank" shape="rect"> here </a> to verify your email.Thanks`
    };
    sgMail.send(message)
    .then((res)=>{
        console.log('email sent')
    })
    .catch((err)=>{
        return res.status(500).send({msg:err.message});
    })


}