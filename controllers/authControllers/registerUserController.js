const jwt= require("jsonwebtoken")
const dotenv= require("dotenv")
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const User= require("../../models/User")
const {CustomError}= require("../../middleWare/error");
const { sendPasswordResetEmail, passwordsetEmail } = require("../authEmailSenders/forgotPasswordEmailSender");
const { loginUserNotfyEmail, welcomeUserEmail, resetUserEmail } = require("../authEmailSenders/UserEmail");
const {uploadOnCloudinary}=require('../../utils/cloudinary')
dotenv.config();

const registerUserController = async (req, res) => {
  // we need to first check the email or the phone no first
    try {
        const { username, email,mobileNo } = req.body;
        if(username==undefined && email==undefined){
          return res.status(404).json({"message": "Provide the email and username"})
        }      
        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" }); // Use 409 for conflict
        }
        const saltRounds = 10;
        // Adjust based on security requirements (higher for more security)
        // here we are going to define a token
        // here we create a temporary password for the user and we need to create a token and email so that user could change the email
        const hashedPassword = await bcrypt.hash(username, saltRounds);
        const newUser = new User({
            username:username,
            email: email,
            mobileNo: mobileNo,
            password: hashedPassword,
        });
        console.log(newUser);
        await newUser.save();
        const passwordtoken = jwt.sign({ _id: newUser._id },"vinayResetPassword", { expiresIn: "1d" }); // Use env variable for secret
        newUser.passwordResetToken= passwordtoken;
        console.log(passwordtoken)
        await newUser.save();
        const passwordResetEmail= await passwordsetEmail(username,email,"www.google.com");
        if(!passwordResetEmail){
          return res.status(422).json({"message": "Unable to verify Email"})
        }
        // going to define the cookies for the again auto logging
        const usertoken= jwt.sign({_id: newUser._id},"vinay", {expiresIn: "3d"});
        res.cookie("usertoken", usertoken, {httpOnly: true}).status(200).json({"message": "User registered Successfully"})
        const welcomeuser= await welcomeUserEmail(email,username, "www.google.com");
        if(welcomeuser){
          console.log("welcome mail send to the user")
        }
        else{
          console.log("welcome mail not send");
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Internal Server Error" }); // Generic error message for security
    }
};

const loginUserController = async (req, res) => {
    try {
      let user;
      if (req.body.email) {
        user = await User.findOne({ email: req.body.email });
      } else if (req.body.username) {
        user = await User.findOne({ username: req.body.username });
      } else {
        return res.status(404).json({ error: "Provide valid username or email" }); // Use 400 for bad request
      }
      if (!user) {
        return res.status(401).json({"message": "User does not exists"})
      }
      console.log(user);
      if(!user.blocked){
        const match = await bcrypt.compare(req.body.password, user.password); // Compare hashed password
          if (!match) {
            return res.status(403).json({"message": "Invalid Password"}) // Use 401 for incorrect password
          }
      
          const { password, ...data } = user._doc;
          const usertoken = jwt.sign({ _id: user._id },"vinay", { expiresIn: "3d" }); // Use env variable for secret
          res.cookie("usertoken", usertoken, { httpOnly: true }).status(200).json(data); // Set httpOnly for security
          const date = new Date();
          const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

          const hours = date.getHours() % 12 || 12;
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
          const formattedTime = `${hours}:${minutes}:${ampm}`;
          
          //todo We need to correct the process.env.
          const emailSend=await loginUserNotfyEmail(user.email,user.username,formattedDate, formattedTime, process.env.PASSWORD_RESET_URL);
          if(emailSend){
            console.log("email also send");
          }
          else{
            console.log("email not send");
          }
      }
      else{
        return res.status(403).json({"message":"Your account has been blocked"})
      }
    } catch (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ message: "Internal server error" }); // Generic error message
    }
  };

  const logoutUserController = async (req, res) => {
    try {
      // Check if the cookie exists before clearing
      if (!req.cookies.usertoken) {
        return res.status(401).json({ message: "User not logged in" }); // 401 for unauthorized
      }
  
      // Clear the token cookie securely if present
      res.clearCookie("usertoken", {
        httpOnly: true,
        sameSite: "none",
        secure: true
      });
  
      // Respond with a success message
      res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" }); // Generic error message
    }
  };

  const refetchUserController = async (req, res) => {
    try {
      // Check for token presence
      const usertoken = req.cookies.usertoken;
      if (!usertoken) {
        return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
      }
  
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(usertoken, "vinay"); // Replace "vinay" with your actual secret key
        const userId = decoded._id;
  
        // Fetch user data using findOne()
        const user = await User.findOne({ _id: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" }); // Use 404 for not found
        }
        else if(user.blocked){
          return res.status(405).json({
            "message": "Your Account is blocked"
          })
        }
        const {password, passwordResetToken,emailChangeToken,...data}= user._doc;
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
  };

  //todo we need to add the functionality of the socialMedia, preffered Location , preffered Events 


  const updateUserProfile= async(req, res,next)=>{
     // here we are going to update the profile of the user and we will not send any notifcations to the user for that
     try {
      // Check for token presence
      const usertoken = req.cookies.usertoken;
      if (!usertoken) {
        return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
      }
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(usertoken, "vinay"); // Replace "vinay" with your actual secret key
        const userId = decoded._id;
        // Fetch user data using findOne()
        const user = await User.findOne({ _id: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" }); // Use 404 for not found
        }
        else if(user.blocked){
          return res.status(405).json({
            "message": "Your Account is blocked"
          })
        }
        // from here we are going to change the data of the user profile
        const {name, socialMedia,mobileNo, bio, description, wanttoCollaborate, age, location, prefferedLocation, prefferedEvents}= req.body;
       
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
        if(wanttoCollaborate){
          user.wanttoCollaborate= wanttoCollaborate;
        }
        if(age){
          user.age= age;
        }
        if(location){
          user.location= location;
        }
        // if(prefferedLocation){
        //   user.prefferedLocation.push(prefferedLocation)
        // }
        // if(prefferedEvents){
        //   user.prefferedEvents.push(prefferedEvents)
        // }
        // going to save the user
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
    }  }
  
  const updateUserEmailGenerator= async(req, res,next)=>{
      // here we are going to send the verification email to the user with the otp
      try {
        const usertoken= req.cookies.usertoken;
        if(!usertoken){
          return res.status(429).json({"message":"Token not found"})
        }
        console.log(usertoken, req,res);
        // Check for token presence
       const loggedInUser= await findLoggedInUser(usertoken);
        if(loggedInUser.blocked){
        return res.status(405).json({
         "message": "Your Account is blocked"
        });
       }
       else if(loggedInUser){
        const {email}= req.body;
        if(!email){
          return res.status(409).json({"message": "Please Enter the new user email"})
        }
          // here we are going to check is the usr email is just same or different 
          if(email==loggedInUser.email){
            return res.status(409).json({
              "message": "Email is same"
            })
          }

          // so the mails are not same and we are going to send a email with a token to the user
          const emailtoken = jwt.sign({ _id:loggedInUser._id },"vinayResetEmail", { expiresIn: "1d" }); // Use env variable for secret
          loggedInUser.emailChangeToken= emailtoken;
          await loggedInUser.save();
          console.log(loggedInUser);
          // going to send the email to the user for the email reset. url contains username, newEmail, token
          const resetEmail= await resetUserEmail(email,loggedInUser.username,"www.google.com");
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

  const updateUserEmailController= async(req,res,next)=>{
    // here we will be going to update the user email
    try {
      // Check for token presence
      const { email, emailChangeToken}= req.body;
      if (!emailChangeToken) {
        return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
      }
  
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(emailChangeToken, "vinayResetEmail"); // Replace "vinay" with your actual secret key
        const userId = decoded._id;
  
        // Fetch user data using findOne()
        const user = await User.findOne({ _id: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" }); // Use 404 for not found
        }
        else if(user.blocked){
          return res.status(405).json({
            "message": "Your Account is blocked"
          })
        }
        // so we had verified the newemail
        user.email= email;
        user.emailChangeToken="";
        user.save();
        return res.status(200).json("Email Updated Successfully")
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

  const updateUserPicture= async(req, res,next)=>{
      try{
        // we are going to first check is the user logged in or not
        const usertoken= req.cookies.usertoken;
        if(!usertoken){
          return res.status(408).json({
            "message": "Please login"
          });
        }
        const loggedInUser= await findLoggedInUser(usertoken);
        if(loggedInUser.blocked){
          return res.status(429).json({"message": "Your account is blocked"})
        }
        else if(loggedInUser){
          //we are going to check the files uploaded by the user for the images
         const profilePicPath= req.files?.profilePicture[0]?.path;
         console.log(profilePicPath)
         const coverPicPath= req.files?.coverPicture[0]?.path;
         console.log(coverPicPath)
         // now we are going to update those data inside our database also
         if(profilePicPath){
             const profilePicture=await uploadOnCloudinary(profilePicPath);
             if(!profilePicture){
               // we failed to upload the image on the Cloudinary
               res.status(408).json({
                 "message": "Error While Updating the image"
               });
             }
             loggedInUser.profilePicture= profilePicture;
         }
         else{
          console.log("please provide the file path")
         }
         if(coverPicPath){
           // so user had also uploaded the cover Picture Path
          const coverPicture= await uploadOnCloudinary(coverPicPath);
          if(!coverPicture){
           // we failed to upload the image on the cloudinarry
           res.status(408).json({
             "message": "Error while Updating the image"
           });
          }
          loggedInUser.coverPicture= coverPicture;
         }
         else{
          console.log("error while updating the picture")
         }
         loggedInUser.save();
         return res.status(200).json({
          "message": "Pictures updated Successfully"
         })
        }
      }
      catch(err){
        console.log(err)
          return res.status(400).json({"message": "Internal Server Error"})
      }
  }

  const avaibleUserUsernames= async(req, res,next)=>{
      
  }

  const updateUserUsernamesController= async(req,res,next)=>{
    try {
      // Check for token presence
      const usertoken= req.cookies.usertoken;
      if(!usertoken){
        return res.status(408).json({
          "message": "Please login"
        });
      }
      const loggedInUser= await findLoggedInUser(usertoken);
      if(loggedInUser.blocked){
        return res.status(429).json({"message": "Your account is blocked"})
      }
      else if(loggedInUser){
        const {username}= req.body;
        if(!username){
          return res.status(490).json({
            "message": "Please provide the new username"
          })
        }
        console.log(username);
        // here we are going to check weather the username is aviable or not
        const existingUser= User.findOne({username: username});
        if(existingUser){
          return res.status(493).json({"message": "Username Already Exists"});
        }
        loggedInUser.username= username;
        loggedInUser.save();
        res.status(200).json({"message": "Username Updated Succesfully"});
      }else{
        return;
      }
    } catch (err) {
      console.error("Unhandled error in refetchUserController:", err);
      return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
    }
  }

  const resetUserPassword= async(req,res,next)=>{
 // here we are going to send the forgot password to the users email 
 try {
  // 1. Validate User Input
  const { email, username } = req.body;
  if (!email && !username) {
    return res.status(429).json({ error: "Please provide either email or username." });
  }

  // 2. Find User Based on Email or Username
  let user;
  if (email) {
    user = await User.findOne({ email });
  } else {
    user = await User.findOne({ username });
  }
console.log(user);
  if (!user) {
    return res.status(404).json({ message: "No user found." });
  }

  const passwordtoken = jwt.sign({ _id: user._id },"vinayResetPassword", { expiresIn: "1d" }); // Use env variable for secret
  user.passwordResetToken= passwordtoken;
  await user.save();

  // 5. Send Password Reset Email (replace with your email sending logic)
  const mailResult=await passwordsetEmail(user.username,user.email, "www.google.com") // Assuming sendPasswordResetEmail function exists
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

  const updateUserPasswordController=async(req, res,next)=>{
    try {
      // Check for token presence
      const {password, passwordResetToken}= req.body;
      if (!passwordResetToken) {
        return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
      }
  
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(passwordResetToken, "vinayResetPassword"); // Replace "vinay" with your actual secret key
        const userId = decoded._id;
  
        // Fetch user data using findOne()
        const user = await User.findOne({ _id: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" }); // Use 404 for not found
        }
        else if(user.blocked){
          return res.status(405).json({
            "message": "Your Account is blocked"
          })
        }
        // so we had verified the newemail
        const saltRounds=10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        user.password= hashedPassword;
        user.passwordResetToken="";
        user.save();
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

  const followUserController = async (req, res, next) => {
    try {
      const usertoken = req.cookies.usertoken;
      if (!usertoken) {
        return res.status(405).json({ message: "Please First login in your account" });
      }
      let loggedInUser;
      try {
        loggedInUser = await findLoggedInUser(usertoken);
        if (!loggedInUser) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        if (loggedInUser.blocked) {
          return res.status(480).json({ message: "Your Account is blocked" });
        }
      } catch (err) {
        console.error("Error finding logged in user:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "Missing user ID to follow" });
      }

      const userToFollow = await User.findOne({ _id: userId });
      if (!userToFollow) {
        return res.status(404).json({ message: "User not found" });
      }

      if (loggedInUser.following.includes(userId)) {
        return res.status(400).json({ message: "Already included in the following list" });
      }

      if (loggedInUser.blockedList.includes(userId)) {
        return res.status(415).json({ message: "Unblock user first" });
      }

      // Add user to following list
      loggedInUser.following.push(userId);
      userToFollow.followers.push(loggedInUser._id);
      // Update logged-in user data
      await User.findOneAndUpdate(
        { _id: loggedInUser._id },
        { following: loggedInUser.following },
        { new: true } // Return the updated document
      );
      await User.findOneAndUpdate(
        {_id: userToFollow._id},
        {followers: userToFollow.followers},
        {new: true}
      );
      res.status(200).json({ message: "Successfully followed the user" });
    } catch (err) {
      console.error("Unhandled error in followUserController:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  const unfollowUserController = async (req, res, next) => {
    try {
      const usertoken= req.cookies.usertoken;
      if (!usertoken) {
        return res.status(405).json({ message: "Please First login in your account" });
      }
      const loggedInUser = await findLoggedInUser(usertoken);
      if (!loggedInUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (loggedInUser.blocked) {
        return res.status(480).json({ message: "Your Account is blocked" });
      }
      const {userId} = req.body;
      if (!userId) {
        return res.status(400).json({ message: "Missing user ID to unfollow" });
      }
      const unfollowUser= await User.findOne({_id: userId});
      if(!unfollowUser){
        return res.status(408).json({
          "message": "Unfollow user does not exists"
        });
      }
      // Update loggedInUser's following list to remove the userToUnfollow
      const updatedFollowing = loggedInUser.following.filter(
        (followedUser) => followedUser.toString() !== userId
      );
      
      loggedInUser.following = updatedFollowing;
      
      const updatedFollowers= unfollowUser.followers.filter(
        (unfollow)=> unfollow.toString() === loggedInUser._id
      );
        unfollowUser.followers= updatedFollowers;
      // Update loggedInUser in the database
        await loggedInUser.save();
       await  unfollowUser.save();
      res.status(200).json({ message: "User unfollowed successfully" });
    } catch (err) {
      console.error("Error in unfollowUserController:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const blockUserController = async (req, res, next) => {
    try {
      const usertoken = req.cookies.usertoken;
      if (!usertoken) {
        return res.status(409).json({ message: "Please First Login" });
      }
      const loggedInUser = await findLoggedInUser(usertoken);
      if (!loggedInUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (loggedInUser.blocked) {
        return res.status(480).json({ message: "Your Account is blocked" });
      }
  
      const { userId } = req.body;
  
      if (!userId) {
        return res.status(400).json({ message: "Missing user ID to block" });
      }
  
      const userToBlock = await User.findOne({ _id: userId });
  
      if (!userToBlock) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (loggedInUser.blockedList.some(blocked => blocked._id.toString() === userId.toString())) {
        return res.status(400).json({ message: "User already blocked" });
      }
  
      loggedInUser.followers = loggedInUser.followers.filter(
        (follower) => follower._id.toString() !== userId.toString()
      );
      loggedInUser.following= loggedInUser.following.filter(
        (following)=> following._id.toString() !==userId.toString()
      );
      loggedInUser.blockedList.push(userToBlock._id);
  
      userToBlock.following = userToBlock.following.filter(
        (following) => following._id.toString() !== loggedInUser._id.toString()
      );
      
      userToBlock.followers= userToBlock.followers.filter(
        (followers)=> followers._id.toString()!== loggedInUser._id.toString()
      );
      await User.findOneAndUpdate(
        { _id: loggedInUser._id },
        loggedInUser,
        { new: true }
      );

      await User.findOneAndUpdate(
        { _id: userToBlock._id },
        userToBlock,
        { new: true }
      );

      res.status(200).json({ message: "User blocked successfully" });
    } catch (err) {
      console.error("Unhandled error in blockUserController:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  //todo we could add the functionality to send the reset password to the users phone no

  const findLoggedInUser= async(usertoken)=>{
    console.log(usertoken);
      if (!usertoken) {
         return null;
      }
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(usertoken, "vinay"); // Replace "vinay" with your actual secret key
        const userId = decoded._id;
  
        // Fetch user data using findOne()
        const user = await User.findOne({ _id: userId });
        if (!user) {
           return null;
        }
        return user;
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
    registerUserController,
     loginUserController,
     logoutUserController,

     avaibleUserUsernames,
     updateUserPicture,
     updateUserEmailController,

     refetchUserController,
     updateUserProfile,
     updateUserUsernamesController,

     resetUserPassword,
     updateUserEmailGenerator,
     updateUserPasswordController,
     
     followUserController,
      unfollowUserController,
    blockUserController
    };
    
