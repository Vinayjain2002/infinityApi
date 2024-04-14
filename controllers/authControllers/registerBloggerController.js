const {CustomError} = require("../../middleWare/error")
const mongoose= require("mongoose")
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt= require("jsonwebtoken")
const Blogger= require("../../models/Blogger");
const { passwordsetEmail } = require("../authEmailSenders/forgotPasswordEmailSender");
const { BloggerWelcome, resetBloggerEmail, loginBloggerNotfyEmail } = require("../authEmailSenders/BloggerEmail");
 
const registerBloggerController= async( req,res)=> {
      // we need to first check the email or the phone no first
    try{
        const {password, username, email}= req.body;
        // we are going to find out the existing users
        const existingBlogger= await Blogger.findOne({$or: [{username}, {email}]})
        if(existingBlogger){
            return res.status(409).json({
                message: "Username or email already exists"
            })
        };  
        const saltRounds= 10;
        if(username == undefined && email== undefined){
            return res.status(430).json({"error": "Please provide the username and the email"})
        } 
        // we are going to send a email to the blogger for the password creation
        
        const hashedPasword= await bcrypt.hash(username, saltRounds)
        const newBlogger= new Blogger({
            ...req.body,
            password: hashedPasword
        });
        await newBlogger.save();
        const passwordtoken = jwt.sign({ _id: newBlogger._id },"vinayBloggerResetPassword", { expiresIn: "1d" }); // Use env variable for secret
        newBlogger.passwordResetToken= passwordtoken;
        await newBlogger.save();
        const passwordResetEmail= await passwordsetEmail(username,email,"www.google.com");
        if(!passwordResetEmail){
          return res.status(436).json({"message": "Unable to verify Email"})
        }

        const bloggertoken= jwt.sign({_id: newBlogger._id}, "vinayBlogger",{expiresIn: "3d"})
        res.cookie("bloggertoken", bloggertoken,{httpOnly: true}).status(201).json({"message": "BLogger Registered Successfuly"});
        const welcomeBlogger= await BloggerWelcome(username,email, "www.google.com");
        if(welcomeBlogger){
            console.log("welcome mail send to the user")
          }
          else{
            console.log("welcome mail not send");
          }
    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"})
    }
};

const refetchBloggerController= async(req,res)=> {
  try {
    // Check for token presence
    const bloggertoken = req.cookies.bloggertoken;
    if (!bloggertoken) {
      return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
    }

    // Validate token using JWT verify
    try {
      const decoded = jwt.verify(bloggertoken, "vinayBlogger"); // Replace "vinay" with your actual secret key
      const bloggerId = decoded._id;

      // Fetch user data using findOne()
      const blogger = await Blogger.findOne({ _id: bloggerId });
      if (!blogger) {
        return res.status(404).json({ message: "Blogger not found" }); // Use 404 for not found
      }
      else if(blogger.blocked){
        return res.status(405).json({
          "message": "Your Account is blocked"
        })
      }
      const {password, passwordResetToken,emailChangeToken,...data}= blogger._doc;
      res.status(200).json(data);
    } catch (err) {
      console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
      // Handle specific errors (e.g., token expiration, database errors)
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      } else if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid user ID" });
      } else {
        return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
      }
    }
  } catch (err) {
    console.error("Unhandled error in refetchUserController:", err);
    return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
  }
}

const loginBloggerController= async(req,res)=>{
    try{
        let blogger;

        if(req.body.email){
            blogger= await Blogger.findOne({email: req.body.email})
        }
        else if(req.body.username){
            blogger= await Blogger.findOne({username: req.body.username})
        }
        else{
            return res.status(400).json({error: "Please provide the username or the email."});
        }
        if(!blogger){
            // user does not found in the database
            return  res.status(401).json({"messsage": "Invalid C  redentials"})
        }
        if(!blogger.blocked){
        const match= await bcrypt.compare(req.body.password, blogger.password )
        if(!match){
            return res.status(401).json({"message": "Invalid Password"}) // Use 401 for incorrect password
        }
        const {password, ...data}= blogger._doc;
        const bloggertoken= jwt.sign({_id: blogger._id}, "vinayBlogger",{expiresIn: "3d"} )
        res.cookie("bloggertoken", bloggertoken, {httpOnly: true}).status(200).json(data);

        const date = new Date();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours}:${minutes}:${ampm}`;
        
        // going to define the email for the blogger login notification
        const emailSend=await loginBloggerNotfyEmail(blogger.email, blogger.username,formattedDate, formattedTime, process.env.PASSWORD_RESET_URL);
      if(emailSend){
        console.log("email also send");
      }
      else{
        console.log("email not send");
      }
    }
    else{
        return res.status(425).json({"message":"Your account is blocked"})
      }
    }
    catch(err){
        res.status(500).json({"message": "Internal Server Error"})
    }
}

const logoutBloggerController = async(req, res)=>{
  try {
    // Check if the cookie exists before clearing
    if (!req.cookies.bloggertoken) {
      return res.status(401).json({ message: "BLogger not logged in" }); // 401 for unauthorized
    }

    // Clear the token cookie securely if present
    res.clearCookie("bloggertoken", {
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    // Respond with a success message
    res.status(200).json({ message: "Blogger logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" }); // Generic error message
  }
}

const updateBloggerProfileController= async (req,res,next)=>{
    // here we are going to update the data related to the bio description, etc
    try {
        // Check for token presence
        const bloggertoken = req.cookies.bloggertoken;
        if (!bloggertoken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
        // Validate token using JWT verify
        try {
          const decoded = jwt.verify(bloggertoken, "vinayBlogger"); // Replace "vinay" with your actual secret key
          const bloggerId = decoded._id;
          // Fetch user data using findOne()
          const blogger = await Blogger.findOne({ _id: bloggerId });
          if (!blogger) {
            return res.status(404).json({ message: "Blogger not found" }); // Use 404 for not found
          }
          else if(blogger.blocked){
            return res.status(405).json({
              "message": "Your Account is blocked"
            })
          }
          // from here we are going to change the data of the user profile
          const {name, socialMedia,mobileNo, bio, description,blogsLevel}= req.body;
          // now we are going to update those data inside our database also
          if(name){
            blogger.name= name;
          }
          // if(socailMedia){
          //   user.socialMedia.push
          // }
          if(mobileNo){
            blogger.mobileNo= mobileNo;
          }
          if(bio){
            blogger.bio= bio;
          }
          if(description){
            blogger.description= description;
          }
          if(blogsLevel){
            blogger.blogsLevel= blogsLevel;
          }
          blogger.save();
          return res.status(200).json({"message": "Profile Updated Successfully"});
        } catch (err) {
          console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
          // Handle specific errors (e.g., token expiration, database errors)
          if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
          } else if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid user ID" });
          } else {
            return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
          }
        }
      } catch (err) {
        console.error("Unhandled error in refetchUserController:", err);
        return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
      }
}


const updateBloggerEmailGenerator= async(req,res,next)=>{
  try {
    const bloggertoken= req.cookies.bloggertoken;
    if(!bloggertoken){
      return res.status(429).json({"message":"Token not found"})
    }
    console.log(bloggertoken);
    // Check for token presence
   const loggedInBlogger= await findLoggedInBlogger(bloggertoken);
   console.log(loggedInBlogger)
    if(loggedInBlogger.blocked){
    return res.status(405).json({
     "message": "Your Account is blocked"
    });
   }
   else if(loggedInBlogger){
    const {email}= req.body;
    if(!email){
      return res.status(409).json({"message": "Please Enter the new email"})
    }
      // here we are going to check is the usr email is just same or different 
      if(email==loggedInBlogger.email){
        return res.status(409).json({
          "message": "Email is same"
        })
      }

      // so the mails are not same and we are going to send a email with a token to the user
      const emailtoken = jwt.sign({ _id:loggedInBlogger._id },"vinayResetEmail", { expiresIn: "1d" }); // Use env variable for secret
      loggedInBlogger.emailChangeToken= emailtoken;
      await loggedInBlogger.save();
      // going to send the email to the user for the email reset. url contains username, newEmail, token
      const resetEmail= await resetBloggerEmail(email,loggedInBlogger.username,"www.google.com");
      if(resetEmail){
        return res.status(200).json({"message": "Email sent to new Email"})
      }
      else{
        return res.status(489).json({"message": "Error while Updating Email"})
      }
   }
   else{
    return res.status(409).json({"message": "Internal Server Error, login again"});
   }
  } catch (err) {
    console.error("Unhandled error in refetchUserController:", err);
    return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
  }
}

const updateBloggerEmailController= async(req, res,next)=>{
     // here we are going to send the verification email to the user with the otp
     try {
        // Check for token presence
        const { email, emailChangeToken}= req.body;
        if (!emailChangeToken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
        if(!email){
          return res.status(469).json({"message": "PLease provide the new Email"})
        }
    
        // Validate token using JWT verify
        try {
          const decoded = jwt.verify(emailChangeToken, "vinayResetEmail"); // Replace "vinay" with your actual secret key
          const bloggerId = decoded._id;
    
          // Fetch user data using findOne()
          const blogger = await Blogger.findOne({ _id: bloggerId });
          if (!blogger) {
            return res.status(404).json({ message: "Blogger not found" }); // Use 404 for not found
          }
          else if(blogger.blocked){
            return res.status(405).json({
              "message": "Your Account is blocked"
            })
          }
          // so we had verified the newemail
          blogger.email= email;
          blogger.emailChangeToken="";
          blogger.save();
          return res.status(200).json("Email Updates Successfully")
        } catch (err) {
          console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
          // Handle specific errors (e.g., token expiration, database errors)
          if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
          } else if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid user ID" });
          } else {
            return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
          }
        }
      } catch (err) {
        console.error("Unhandled error in refetchUserController:", err);
        return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
      }
}

const updateBloggerPictureController = async(req, res,next)=>{
    // here we are going to define the code for the pictures ie the profile picture and the cover pictures

}

const updateBloggerUsernameController= async(req, res,next)=>{
    try {
        // Check for token presence
        const loggedInBlogger= await findLoggedInBlogger();
        if(loggedInBlogger){
          const {username}= req.body;
          // here we are going to check weather the username is aviable or not
          const existingBlogger= Blogger.findOne({username});
          if(existingBlogger){
            return res.status(493).json({"message": "Username Already Exists"});
          }
          blogger.username= username;
          blogger.save();
          res.status(200).json({"message": "Username Updated Succesfully"});
        }else{
          return;
        }
      } catch (err) {
        console.error("Unhandled error in refetchUserController:", err);
        return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
      }
}

const aviableBloggerUsernames = async(req, res, next)=>{

}

const resetBloggerPassword = async(req,res,next)=>{
// here we are going to send the forgot password to the users email 
 try {
  // 1. Validate User Input
  const { email, username } = req.body;

  if (!email && !username) {
    return res.status(429).json({ error: "Please provide either email or username." });
  }

  // 2. Find User Based on Email or Username
  let blogger
  if (email) {
    blogger = await Blogger.findOne({ email });
  } else {
    blogger = await Blogger.findOne({ username });
  }
  if (!blogger) {
    return res.status(404).json({ message: "No user found." });
  }

  const passwordtoken = jwt.sign({ _id: blogger._id },"vinayBloggerResetPassword", { expiresIn: "1d" }); // Use env variable for secret
  blogger.passwordResetToken= passwordtoken;
  await blogger.save();

  // 5. Send Password Reset Email (replace with your email sending logic)
  const mailResult=await passwordsetEmail(blogger.username,blogger.email, "www.google.com") // Assuming sendPasswordResetEmail function exists
  if(mailResult){
    return res.status(200).json({ message: "Password reset email sent successfully." });
  }
  else{
    return res.status(430).json({"message": "Some erro while sending the email"})
  }
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: "An error occurred. Please try again later." });
}
}

const findBloggerByPrefixNameController = async( req, res,next)=>{
  try {
    const {username} = req.body;  // Adjust based on how you pass the prefix
    console.log(username)
    const blogger = await Blogger.find({
      username: { $regex: `^${username}`, $options: 'i' }
    });

    if (!blogger.length) {
      return res.json({ message: 'No bloggers found' });
    }
    return res.status(200).json({"message": "Bloggers found","data": blogger}); // Send the list of matching bloggers
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const findAllBloggersController = async (req, res, next) => {
  try {
    const bloggers = await Blogger.find();
    const bloggerCount = bloggers.length; // More efficient way to get the count

    return res.status(200).json({
      "message": "Fetched all bloggers",
      "no of Bloggers": bloggerCount,
      "data": bloggers
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({
      "error": "Internal Server Error"
    });
  }
};


const updateBloggerPasswordController=async(req, res,next)=>{
    try {
      // Check for token presence
      const {password, passwordResetToken}= req.body;
      if (!passwordResetToken) {
        return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
      }
      if(!password){
        return res.status(404).json({"message": "Please provide the new Password"})
      }
  
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(passwordResetToken, "vinayBloggerResetPassword"); // Replace "vinay" with your actual secret key
        const bloggerId = decoded._id;
  
        // Fetch user data using findOne()
        const blogger = await Blogger.findOne({ _id: bloggerId });
        if (!blogger) {
          return res.status(404).json({ message: "Blogger not found" }); // Use 404 for not found
        }
        else if(blogger.blocked){
          return res.status(405).json({
            "message": "Your Account is blocked"
          })
        }
        // so we had verified the newemail
        blogger.password= password;
        blogger.passwordResetToken="";
        blogger.save();
        return res.status(200).json("Password Updated Successfully")
      } catch (err) {
        console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
        // Handle specific errors (e.g., token expiration, database errors)
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: "Unauthorized: Invalid token" });
        } else if (err.name === 'CastError') {
          return res.status(400).json({ message: "Invalid user ID" });
        } else {
          return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
        }
      }
    } catch (err) {
      console.error("Unhandled error in refetchUserController:", err);
      return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
    }
  }


  const findLoggedInBlogger= async(bloggertoken)=>{
    console.log(bloggertoken);
      if (!bloggertoken) {
         return null;
      }
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(bloggertoken, "vinayBlogger"); // Replace "vinay" with your actual secret key
        const bloggerId = decoded._id;
  
        // Fetch user data using findOne()
        const blogger = await Blogger.findOne({ _id: bloggerId });
        if (!blogger) {
           return null;
        }
        return blogger;
      } catch (err) {
        console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
        // Handle specific errors (e.g., token expiration, database errors)
        if (err.name === 'JsonWebTokenError') {
           res.status(401).json({ message: "Unauthorized: Invalid token" });
           return null;
        } else if (err.name === 'CastError') {
           res.status(400).json({ message: "Invalid user ID" });
           return null;
        } else {
           res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
           return null;
        }
      }
  }
  
module.exports= {
    registerBloggerController, 
    refetchBloggerController, 
    loginBloggerController,
     logoutBloggerController,
    updateBloggerEmailController,
     updateBloggerProfileController,
    resetBloggerPassword,
    updateBloggerPasswordController,
    updateBloggerEmailGenerator,

    // finding the bloggers
    findBloggerByPrefixNameController,
    findAllBloggersController,

    // left 
    updateBloggerPictureController, 
    updateBloggerUsernameController,
    aviableBloggerUsernames,



};