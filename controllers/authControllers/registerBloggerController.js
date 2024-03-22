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
        };        // so the user does not exists and need to be created
        const saltRounds= 10;
        if(username == undefined || email== undefined){
            return res.status(430).json({"error": "Please provide the username and the email"})
        } 
        // we are going to send a email to the blogger for the password creation
        const passwordtoken = jwt.sign({ _id: user._id },"vinayBloggerResetPassword", { expiresIn: "1d" }); // Use env variable for secret
        const passwordResetEmail= await passwordsetEmail(username,email,"www.google.com");
        if(!passwordResetEmail){
          return res.status(436).json({"message": "Unable to verify Email"})
        }
        const hashedPasword= await bcrypt.hash(username, saltRounds)
        const newBlogger= new Blogger({
            ...req.body,
            password: hashedPasword
        });
        newBlogger.save();

        const bloggertoken= jwt.sign({_id: newBlogger._id}, "vinayBlogger",{expiresIn: "3d"})
        res.cookie("bloggertoken", bloggertoken,{httpOnly: true}).status(201).json({"message": "BLogger Registered Successfuly"});
        const welcomeBlogger= await BloggerWelcome(username,email);
        if(welcomeBlogger){
            console.log("welcome mail send to the user")
          }
          else{
            console.log("welcome mail not send");
          }
        // going to send the welcome email to the blogger

    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"})
    }
};

const refetchBloggerController= async(req,res)=> {
    try{
        const bloggertoken= req.cookies.bloggertoken;
        if(!bloggertoken){
            return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
       jwt.verify(token, "vinayBlogger", {}, async(err,data)=>{
        if(err){
            return  res.status(405).json({
            "message": "Cookies not found"
            })
        }
        try{
            const id= data._id;
            const blogger= Blogger.findOne({_id: id});
            if (!blogger) {
                return res.status(404).json({ message: "Blogger not found" }); // Use 404 for not found
              }
              else if(blogger.blocked){
                return res.status(405).json({
                  "message": "Your Account is blocked"
                })
              }
        
            const {password, ...data}= blogger._doc;
            res.status(200).json(data)
        }
        catch(err){
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
       });
    }
    catch(err){
        return new CustomError("Internal Server Error", 500);
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
            return  new CustomError("Invalid Credentials", 401)
        }
        if(!blogger.blocked){
        const match= await bcrypt.compare(req.body.password, blogger.password )
        if(!match){
            return res.status(401).json({"message": "Invalid Password"}) // Use 401 for incorrect password
        }
        const {password, ...data}= user._doc;
        const bloggertoken= jwt.sign({_id: user._id}, "vinayBlogger",{expiresIn: "3d"} )
        res.cookie("bloggertoken", bloggertoken, {httpOnly: true}).status(200).json(data);

        const date = new Date();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours}:${minutes}:${ampm}`;
        
        // going to define the email for the blogger login notification
        const emailSend=await loginBloggerNotfyEmail(user.email,user.username,formattedDate, formattedTime, process.env.PASSWORD_RESET_URL);
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
    try{
        if(!req.cookies.bloggertoken){
            // cookie is not present
            return res.status(401).json({"message": "Blogger not logged in"})
        }

        res.clearCookie("bloggertoken", {
            httpOnly: true,
            sameSite: "none",
            secure: true
        })

        res.status(200).json({message: "Internal Server eror"})
    }
    catch(err){
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
            return res.status(404).json({ message: "User not found" }); // Use 404 for not found
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
            user.name= name;
          }
          // if(socailMedia){
          //   user.socialMedia.push
          // }
          if(mobileNo){
            user.mobileNo= mobileNo;
          }
          if(bio){
            user.bio= bio;
          }
          if(description){
            user.description= description;
          }
          if(blogsLevel){
            user.blogsLevel= blogsLevel;
          }
          user.save();
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
        // Check for token presence
       const loggedInBlogger= await findLoggedInBlogger();
       if(loggedInBlogger){
        const {email}= req.body;
          // here we are going to check is the usr email is just same or different 
          if(email==loggedInBlogger.email){
            return res.status(409).json({
              "message": "Email is same"
            })
          }

          // so the mails are not same and we are going to send a email with a token to the user
          const emailtoken = jwt.sign({ _id: user._id },"vinayBloggerResetEmail", { expiresIn: "1d" }); // Use env variable for secret
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
        return;
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
        const { email, emailtoken}= req.body;
        if (!emailtoken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
    
        // Validate token using JWT verify
        try {
          const decoded = jwt.verify(emailtoken, "vinayBloggerResetEmail"); // Replace "vinay" with your actual secret key
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

const forgotBloggerPassword= async(req,res,next)=>{

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
  if (blogger) {
    blogger = await Blogger.findOne({ email });
  } else {
    blogger = await Blogger.findOne({ username });
  }
  if (!blogger) {
    return res.status(404).json({ message: "No user found." });
  }

  const passwordtoken = jwt.sign({ _id: user._id },"vinayBloggerResetPassword", { expiresIn: "1d" }); // Use env variable for secret
  blogger.passwordResetToken= passwordtoken;
  await user.save();

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


const updateBloggerPasswordController=async(req, res,next)=>{
    try {
      // Check for token presence
      const {password, passwordtoken}= req.body;
      if (!passwordtoken) {
        return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
      }
  
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(passwordtoken, "vinayBloggerResetPassword"); // Replace "vinay" with your actual secret key
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


  const findLoggedInBlogger= async(req,res,next)=>{
    const bloggertoken = req.cookies.bloggertoken;
      if (!bloggertoken) {
         res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
         return null;
      }
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(bloggertoken, "vinayBlogger"); // Replace "vinay" with your actual secret key
        const bloggerId = decoded._id;
  
        // Fetch user data using findOne()
        const blogger = await Blogger.findOne({ _id: bloggerId });
        if (!blogger) {
           res.status(404).json({ message: "blogger not found" }); // Use 404 for not found
           return null;
        }
        else if(blogger.blocked){
           res.status(405).json({
            "message": "Your Account is blocked"
          });
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
       updateBloggerPictureController, 
    updateBloggerUsernameController,
    aviableBloggerUsernames,
    forgotBloggerPassword,
    resetBloggerPassword,
    updateBloggerPasswordController
};