const nodemailer= require("nodemailer");



async function  ProjectUploaderWelcome(username, useremail){
    try{
      // here we are going to define the text for the sending of the email
      const senderemail= "infinetyassist@gmail.com";
      const supportemail= "infinetyguidance@gmail.com";
      const senderpassword="nash qxci depr ydhl";
      const text = `
      Dear ${username},
        \n
        We're impressed by your project details on Infinity! Sharing your innovative work empowers our tech community. Your insights will spark curiosity and ignite inspiration in countless viewers – students, developers, and anyone passionate about technology.
Infinity thrives on knowledge exchange, and your project details perfectly embody that spirit. They'll reach a vast audience eager to learn from your creation.

Thank you for contributing! We're proud to have you on Infinity. Keep exploring, building, and sharing your amazing ideas!
\n
The Infinity Team
  `;
  const subject= `Your Project Ignites Inspiration on Infinity!`;
  const result= await sendEmail(senderemail,senderpassword,useremail,subject,text );
      if(result){
        console.log("Successfully send the email to the admin")
        return true;
      }
      else{
        console.log("email not send to admin.")
        return false;
      }
      } 
      catch(err){
        console.log(err)
        console.log("Error while creating the email");
        return false;
      }
  }
  
async function sendEmail(senderemail, senderpassword, useremail, subject, text) {
  try {
      const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
              user: senderemail,
              pass: senderpassword
          }
      });
      const mailSender = await transporter.sendMail({
          from: "Team Infinity",
          to: useremail,
          subject: subject,
          text: text,
      });
      return true; // Email sent successfully
  } catch (err) {
      return false; // Error while sending the email
  }
}


module.exports={ProjectUploaderWelcome};