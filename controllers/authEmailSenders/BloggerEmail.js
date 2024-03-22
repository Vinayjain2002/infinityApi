const nodemailer= require("nodemailer");


async function AccountBlocked(bloggername,bloggeremail){
    try{
      // here we are going to define the text for the sending of the email
      const senderemail= "infinetyassist@gmail.com";
      const supportemail= "infinetyhelpdesk@gmail.com";
      const senderpassword="";
      const text = `
      Dear ${bloggername},
\n
We are writing to inform you that your Blogger account has been blocked due to repeated violations of our Terms of Service.
\n
We take the safety and integrity of our platform very seriously, and we strive to maintain a positive environment for all users. Unfortunately, after multiple warnings regarding your blog content, we have found continued violations of our policies related to  hate speech, copyright infringement, etc.
\n
<b>Prior Warnings:</b>
We previously sent you many times alerts notifying you of the policy violations in your blog posts. These alerts included a reminder of our Terms of Service and steps to ensure your content adheres to them. You can find a detailed explanation of our Terms of Service here: ${link}.
\n
<b>Account Block:</b>
Despite prior warnings, your continued policy violations have left us with no choice but to block your account. This means you will be unable to access or post to your blog at this time.
\n
<b>Appeal Process:</b>
If you believe your account has been blocked in error, you have the right to appeal. You can submit an appeal by replying to this email and explaining why you believe your content did not violate our policies. Our team will carefully review your appeal and respond within 7 business days.
\n
However, please be aware that continued disregard for our policies may result in permanent termination of your Blogger account.
\n
<b>Moving Forward:</b>
We highly recommend reviewing our Terms of Service to ensure future blog content aligns with our guidelines. We value your contribution to the Blogger community and hope you can continue to share your thoughts and ideas in a way that adheres to our policies.
\n
If you have any questions, please do not hesitate to contact Blogger Support at [Link to Blogger Support].
\n\n
Sincerely,
Team Infinity
         `;
      const subject= `<b>Important Notice:</b> Blogger Account Blocked Due to Policy Violations`;
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




async function BloggerWelcome(bloggername, bloggeremail){
    try{
      // here we are going to define the text for the sending of the email
      const senderemail= "infinetyassist@gmail.com";
      const supportemail= "infinetyguidance@gmail.com";
      const senderpassword="";
      const text = `
      Dear ${bloggername},
        \n
  Welcome to Infinity! We are thrilled to have you join our community of bloggers. Your passion for writing and sharing ideas aligns perfectly with our vision, and we can't wait to see the amazing content you'll create.
  As a blogger on Infinity, you'll have the opportunity to reach a wide audience and connect with like-minded individuals. Whether you're sharing your thoughts, experiences, or expertise, your voice matters, and we're here to support you every step of the way.
  To get started, please visit our platform and familiarize yourself with the tools and resources available to you. If you have any questions or need assistance, feel free to reach out to our support team at ${supportemail}.
  Once again, welcome to Infinity! We're excited to embark on this blogging journey with you.
  Download Infinty today and unlock your full tech potential!  ${linktoplaystore}
  See you there!
\N
The Infinity Team
  `;
  const subject= `Welcome to Infinity - Your Blogging Journey Begins Here!`;
  const result= await sendEmail(senderemail,senderpassword, bloggeremail,subject,text );
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
        console.log("Error while creating the email");
        return false;
      }
  }
  
  async function RemovedBlog(blogname, bloggername, bloggeremail){
    try{
        // here we are going to define the text for the sending of the email
        const senderemail= "infinetyassist@gmail.com";
        const supportemail= "infinetysolution@gmail.com";
        const senderpassword="";
        const text = `
        Dear ${bloggername},
\n
We are writing to inform you that your blog, "${blogname}" has been removed from Blogger due to a violation of our Terms of Service.
\n
We take the safety and security of our platform very seriously and strive to maintain a positive environment for all users. Unfortunately, your blog contained content that breached our policies regarding  hate speech, copyright infringement, etc.
\n
You can find a detailed explanation of our Terms of Service here: ${link}.
\n
If you believe this removal is a mistake, you have the right to appeal. You can submit an appeal by replying to this email and explaining why you believe the content did not violate our policies. Our team will carefully review your appeal and respond within 7 business days.
\n
Please note: Repeated violations of our Terms of Service may result in the termination of your Blogger account.
\n
We understand that this may be frustrating news, and we apologize for any inconvenience caused. However, upholding our policies is essential to maintaining a safe and enjoyable experience for all Blogger users.
\n
If you have any questions, please do not hesitate to contact Blogger Support at [Link to Blogger Support].
\n\n
Sincerely,
 Team Infinity  `;
 const subject= ` <b>Important Notice:</b> Removal of Your Blog "${blogname}"`;
 const result= await sendEmail(senderemail,senderpassword, bloggeremail,subject,text );
     if(result){
       console.log("Successfully send the email to the blogger")
       return true;
     }
     else{
       console.log("email not send to blogger.")
       return false;
     }
  }
  catch(err){
    console.log("Error while sending the email the email");
    return false;
  }
}

async function resetBloggerEmail(useremail,username,link){
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

async function loginBloggerNotfyEmail(useremail, username, date, time,link){
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


  module.exports={AccountBlocked, BloggerWelcome, resetBloggerEmail,RemovedBlog,loginBloggerNotfyEmail};