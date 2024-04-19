const nodemailer= require("nodemailer");

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
      const subject= `<b>Account Blocked</b>`;
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

async function welcomeUserEmail(useremail, username,linktoplaystore){
  try{
    console.log(useremail, username, linktoplaystore)
    // here we are going to define the text for the sending of the email
    const senderemail= "infinetyassist@gmail.com";
    const supportemail= "infinetyhelpdesk@gmail.com";
    const senderpassword="nash qxci depr ydhl";
    const text = `
    Hey ${username},
\n
    Excited to introduce you to Infinity, your one-stop shop for everything tech-related!
\n
Here's what you can do with Infinity:
\n
Stay Informed: Dive deep into our library of tech blogs, covering the latest trends and advancements in the industry.
Never Miss an Event: Discover upcoming tech events, workshops, bootcamps, and hackathons – all in one place. Find the perfect opportunity to showcase your skills!
Team Up & Conquer: Collaborate online with other students to form teams, brainstorm ideas, and tackle tech challenges together.
Learn On Your Terms: Explore our comprehensive library of tutorials, covering a wide range of programming languages and technologies.
\n
At Infinity, we believe the education never ends. Whether you're a coding beginner or a seasoned developer, our platform empowers you to:
\n
Gain valuable knowledge and skills.
Network with fellow tech enthusiasts.
Prepare for your dream tech career.
\n
Download Infinty today and unlock your full tech potential!  ${linktoplaystore}
See you there!
\n

The Infinity Team
    `;
    const subject= `Level Up Your Tech Skills with Infinity!`;
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
      console.log(err);
      console.log("Error while creating the email");
    }
}

async function resetUserEmail(useremail,username,link){
  try{
    console.log(useremail,username);
    // here we are going to define the text for the sending of the email
    const senderemail= "infinetyassist@gmail.com";
    const supportemail= "infinetyhelpdesk@gmail.com";
    const senderpassword="nash qxci depr ydhl";
    const text = `Hi ${username},

    You requested a change to your email address. To confirm this update, click the link below:
  ${link} (This link will expire in 24 hours).

  If you didn't request this change, simply ignore this email.
  For your security, we recommend keeping your account information up to date.
  

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
async function loginUserNotfyEmail(useremail, username, date, time,link){
  try{
    // here we are going to define the text for the sending of the email
    const senderemail= "infinetyassist@gmail.com";
    const supportemail= "infinetyhelpdesk@gmail.com";
    const senderpassword="nash qxci depr ydhl";
    const text = `
  Hi ${username},

  Heads up! We saw a login attempt on ${date}, ${time} you might not have made. Secure your account by resetting your password: ${link}

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

  module.exports= {AccountBlocked, welcomeUserEmail, loginUserNotfyEmail, resetUserEmail};