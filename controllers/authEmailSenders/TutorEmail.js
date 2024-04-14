const nodemailer= require("nodemailer");

async function resetTutorEmail(useremail,username,link){
  try{
    // here we are going to define the text for the sending of the email
    const senderemail= "infinetyassist@gmail.com";
    const supportemail= "infinetyhelpdesk@gmail.com";
    const senderpassword="nash qxci depr ydhl";
    const text = `Hi ${username},
  \n
  You requested a change to your email address. To confirm this update, click the link below:
  ${link} (This link will expire in 24 hours).
  If you didn't request this change, simply ignore this email.
  \n
  For your security, we recommend keeping your account information up to date.
  \n
  Sincerely,
  The Infinity Team 
    `;
    const subject= `Update Your Email Address.`;
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
async function TutorWelcome(tutorname,tutoremail){
    try{
      // here we are going to define the text for the sending of the email
      const senderemail= "infinetyassist@gmail.com";
      const supportemail= "infinetyguidance@gmail.com";
      const senderpassword="nash qxci depr ydhl";
      const text = `
Dear ${tutorname},
        \n\n
Welcome to Infinity! We are delighted to have you join our team of tutors. Your expertise and dedication will make a significant impact on the learning journeys of our students.
        \n
As a tutor on Infinity, you will have the opportunity to share your knowledge, inspire others, and help students achieve their academic goals. Your commitment to excellence is commendable, and we are confident that you will make a difference in the lives of our students.
      \n
To get started, please familiarize yourself with our platform and explore the tools and resources available to you. If you have any questions or need assistance, please do not hesitate to contact our support team at ${supportemail}.
      \n\n
Thank you for choosing to be a part of Infinity. We look forward to a successful tutoring journey together.`;
      const subject= `Welcome to Infinity - Your Blogging Journey Begins Here!`;
      const result= await sendEmail(senderemail,senderpassword, tutoremail,subject,text );
      if(result){
        console.log("Successfully send the welcome email to the Tutor")
        return true;
      }
      else{
        console.log("email not send to Tutor.")
      }
      } 
      catch(err){
        console.log("Error while creating the email");
      }
  }
  
  async function AccountBlocked(name,email){
    try{
      // here we are going to define the text for the sending of the email
      const senderemail= "infinetyassist@gmail.com";
      const supportemail= "infinetyhelpdesk@gmail.com";
      const senderpassword="";
      const text = `
      Dear ${name},
          \n
  We regret to inform you that your account is being blocked due to violations of our policy. This action is taken in accordance with our terms of service to maintain a safe and respectful environment for all users.
  \n
  For any queries regarding this action or to appeal the decision, please contact our support team at ${supportemail}. We are here to assist you and address any concerns you may have.
      `;
      const subject= `Account Blocked`;
      const result= await sendEmail(senderemail,senderpassword, email,subject,text );
      if(result){
        console.log("Successfully send the email.")
        return true;
      }
      else{
        console.log("email not send.")
      }
      } 
      catch(err){
        console.log("Error while creating the email");
      }
  }


  async function loginTutorNotfyEmail(useremail, username, date, time,link){
    try{
      // here we are going to define the text for the sending of the email
      const senderemail= "infinetyassist@gmail.com";
      const supportemail= "infinetyhelpdesk@gmail.com";
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

  module.exports= {TutorWelcome,loginTutorNotfyEmail, resetTutorEmail};