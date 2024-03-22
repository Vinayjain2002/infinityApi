const nodemailer= require("nodemailer");

const transporter= nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gamil.com",
    port: 587,
    secure: false,
    auth: {
        user: "infinetyservice@gmail.com",
        pass: "ucww tcsw papi axqv"
    }
})

async function sendPasswordResetEmail(user,token){
  
  try{
    const mailSender= await transporter.sendMail({
        from: "Infinity Support",
        to: "jainv61787@gmail.com",
        subject: "Hello Vinay jain",
        text: "Your password reset link is",
        html: "<a>www.google.com</a>"
        // attachements: [
        //    {
        //     filename: "",
        //     path: path.join(__dirname,"filename")
        //    },
        //    {
        //     filename: "secondfile",
        //     path: 
        //    }
        // ]
    });
    console.log("password sent Succesfully")
  }
  catch(err){
    console.log(`error While Sending the email is ${err}`)
  }
}

module.exports= {sendPasswordResetEmail};