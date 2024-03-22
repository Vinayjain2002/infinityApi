const nodemailer= require("nodemailer");

async function passwordsetEmail(username, useremail,link){
    try{
        // here we are going to define the text for the sending of the email
        const senderemail= "infinetyassist@gmail.com";
        const senderpassword="nash qxci depr ydhl";
        const supportemail= "infinetyhelpdesk@gmail.com";
        const text = `
  Dear ${username},
  Welcome to Infinity!\n
  To complete your profile and set your password, please click on the following link: ${link}
  \n
  For any technical support, please email us at ${supportemail}\n
  Best regards,
  The Infinity Team
    `;
    const subject= `Set your password`;
    const result= await sendEmail(senderemail,senderpassword, useremail,subject,text );
    if(result){
      console.log("Password reset Email Send Successfully")
      return true;
    }
    else{
      console.log("Password resend email not send.")
    }
    } 
    catch(err){
      console.log(err)
      console.log("Error while creating the email");
    }
}

async function emailChangeMail(username, useremail, newuseremail){
  try{
    // here we are going to define the text for the sending of the email
    const senderemail= "infinetyassist@gmail.com";
    const senderpassword="nash qxci depr ydhl";
    const raiseConcern="infinetysolution@gmail.com";
    const supportemail= "infinetyhelpdesk@gmail.com";
    const text = `
    Dear ${username},
    \n
    This email is to inform you that your email address has been changed to ${newuseremail}.  If you did not initiate this change, please reach out to our support team immediately at ${raiseConcern}.
    \n
    To ensure your continued access to all our services, we recommend updating any other accounts or services associated with your old email address as soon as possible.
    \n
    For any further questions, please don't hesitate to contact us at ${supportemail}.
    
    Sincerely,
    Team Infinity.
`;
const subject= `Your Account Email Address Has Changed`;
const result= await sendEmail(senderemail,senderpassword, useremail,subject,text );
if(result){
  console.log("Password reset Email Send Successfully")
  return true;
}
else{
  console.log("Password resend email not send.")
}
} 
catch(err){
  console.log("Error while creating the email");
} 
}

async function passwordChangeMail(username, useremail){
  try{
    // here we are going to define the text for the sending of the email
    const senderemail= "infinetyassist@gmail.com";
    const senderpassword="nash qxci depr ydhl";
    const raiseConcern="infinetysolution@gmail.com";
    const supportemail= "infinetyhelpdesk@gmail.com";
    const text = `
Dear ${username},
    \n
This email is to inform you that your password for your Infinity account has been changed.
    \n
Didn't do this? Contact support immediately: ${raiseConcern}
    \n
Log in with your new password to keep using your account.
    \n    
For any questions, reply to this email or contact ${supportemail}.
    \n
    \n
Sincerely,
Team Infinity
    
`;
const subject= `Set your password`;
const result= await sendEmail(senderemail,senderpassword, useremail,subject,text );
if(result){
  console.log("Password reset Email Send Successfully")
  return true;
}
else{
  console.log("Password resend email not send.")
}
} 
catch(err){
  console.log("Error while creating the email");
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

module.exports= {passwordsetEmail,passwordChangeMail, emailChangeMail};