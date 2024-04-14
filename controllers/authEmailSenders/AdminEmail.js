const nodemailer= require("nodemailer");


async function sendAdminApllicationEmail(adminname, adminemail,link){
    try{
          // here we are going to define the text for the sending of the email
          const senderemail= "infinetyassist@gmail.com";
          const supportemail= "infinetycare@gmail.com";
          const senderpassword="nash qxci depr ydhl";
          const text = `
  Dear ${adminname},
          \n
  Welcome to Infinity!\n
  You have successfully applied for the admin role. Your application is currently under review. To keep track of your application status, please visit ${link}.
          \n
  For any technical support, please email us at ${supportemail}\n
          \n
  Best regards,\n
  The Infinity Team
      `;
      const subject= `Application for Admin Role Received`;
      const result= await sendEmail(senderemail,senderpassword, adminemail,subject,text );
      if(result){
        console.log("Successfully send the email to the admin")
        return true;
      }
      else{
        console.log(" email not send to admin.")
      }
      } 
      catch(err){
        console.log("Error while creating the email");
      }
  }


async function approvedAsAdmin(adminname,adminemail,link){
  try{
       // here we are going to define the text for the sending of the email
       const senderemail= "infinetyassist@gmail.com";
       const supportemail= "infinetyguidance@gmail.com";
       const senderpassword="";
       const text = `
       Dear ${adminname},\n
Welcome to Infinity team!\n
\n
We are pleased to inform you that your application for the admin role has been approved. Your dedication and qualifications have made you a valuable addition to our team.
\n
For further information and onboarding details, please reach out to us at ${link}. We look forward to working with you and are confident that you will contribute significantly to the success of our team.
\n
Once again, congratulations on becoming a part of the Infinity team. We are excited to have you on board!
       \n
For any technical support, please email us at ${supportemail}\n
\n
Best regards,\n
The Infinity Team
   `;
   const subject= `Approved as Admin`;
   const result= await sendEmail(senderemail,senderpassword, adminemail,subject,text );
   if(result){
     console.log("Successfully send the email to the admin")
     return true;
   }
   else{
     console.log("email not send to admin.")
   }
   } 
   catch(err){
     console.log("Error while creating the email");
   }

}

async function loginAdminNotfyEmail(useremail, username, date, time,link){
  try{
        // here we are going to define the text for the sending of the email
    const senderemail= "infinetyassist@gmail.com";
    const supportemail= "infinetycare@gmail.com";
    const senderpassword="nash qxci depr ydhl";
    const text = `
  Hi ${username},
  Heads up! We saw a login attempt on ${date}, ${time} you might not have made. Secure your account by resetting your password: ${link}
    \n
  The Infinity Team
    `;
    const subject= `Potential Access! Check Your Account`;
    const result= await sendEmail(senderemail,senderpassword, useremail,subject,text );
    if(result){
      console.log("Successfully send the email.")
      return true;
    }
    else{
      console.log("email not send.")
    }
    } 
    catch(err){
      console.log
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

  module.exports={sendAdminApllicationEmail, approvedAsAdmin, loginAdminNotfyEmail};