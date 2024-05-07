const nodemailer= require("nodemailer");



async function ProjectUploaderWelcome(username, useremail){
    try{
      // here we are going to define the text for the sending of the email
      const senderemail= "infinetyassist@gmail.com";
      const supportemail= "infinetyguidance@gmail.com";
      const senderpassword="nash qxci depr ydhl";
      const text = `
      Dear ${username},
        \n
        Wowed by your  video! Sharing your experience empowers our tech community. Your insights will inspire countless viewers – students, enthusiasts, and anyone curious about the tech Events.
        Infinity thrives on knowledge sharing, and your video perfectly embodies that spirit. It will reach a vast audience eager to learn from you.
        Thank you for contributing! We're proud to have you on Infinity. Keep exploring and creating!
\N
The Infinity Team
  `;
  const subject= `Your Video Shines on Infinity!`;
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
  
async function BlockedVideo(title, username, useremail){
    try{
        // here we are going to define the text for the sending of the email
        const senderemail= "infinetyassist@gmail.com";
        const supportemail= "infinetysolution@gmail.com";
        const senderpassword="";
        const text = `
Hi ${username},We 
′
 rewritingtoinformyouthatyourvideo,${title} on Infinity, has been removed due to a violation of our Terms of Service. Maintaining a safe and positive environment for everyone is our top priority.

Unfortunately, your video contained content that breached our policies regarding hate speech, copyright infringement, or other violations.

Appeal Your Removal:

If you believe this is a mistake, you have the right to appeal. Simply reply to this email and explain why your video complies with our policies. Our team will review your appeal within 7 business days.

Repeated Violations:

Please note, repeated violations may lead to account termination.

We understand this might be frustrating. However, enforcing these policies is crucial for our community's well-being.

Need Help?

If you have questions, contact Infinty Support at ${supportemail}.

Sincerely,
 Team Infinity  `;
 const subject= ` <b>Important Notice:</b> BLocking of Your Video "${title}"`;
 const result= await sendEmail(senderemail,senderpassword, useremail,subject,text );
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

async function DeletedVideo(title, username, useremail,){
    try{
        // here we are going to define the text for the sending of the email
        const senderemail= "infinetyassist@gmail.com";
        const supportemail= "infinetysolution@gmail.com";
        const senderpassword="";
        const text = `
Hi ${username},

Thisisafollow−upregardingyourvideo, ${title}. It was removed from Infinity for violating our Terms of Service. Maintaining a safe platform is our priority.

While the appeal window has closed, we encourage you to review our Terms (see: www.google.com) to avoid future issues.

Repeated violations may lead to account limitations.

We understand this might be frustrating. However, these policies ensure a positive experience for everyone.

Questions? Contact Infinity Support at ${supportemail}.

Sincerely,

The Infinity Team `;
 const subject= ` Removal of Your Video "${title}"`;
 const result= await sendEmail(senderemail,senderpassword, useremail,subject,text );
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


module.exports={DeletedVideo,BlockedVideo,VideoUploaderWelcome};