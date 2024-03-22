const jwt= require("jsonwebtoken")
const dotenv= require("dotenv")
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const User= require("../../models/User")
const {CustomError}= require("../../middleWare/error");
const { sendPasswordResetEmail } = require("../authEmailSenders/forgotPasswordEmailSender");
dotenv.config();

const registerUserController = async (req, res) => {
  // we need to first check the email or the phone no first
    try {
        const { password, username, email } = req.body;
        if(!username && !email){
          return res.status(409).json({"message": "Please provide the email and the password"})
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email already exists" }); // Use 409 for conflict
        }
        const saltRounds = 10;
        if(username == undefined || email== undefined){
          throw new CustomError("Please provide the username adn email")
        } // Adjust based on security requirements (higher for more security)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            ...req.body,// Store the hashed password
            password: hashedPassword,
        });
        newUser.save();
        // going to define the cookies for the again auto logging
        const token= jwt.sign({_id: newUser._id},"vinay", {expiresIn: "3d"});
        res.cookie("token", token, {httpOnly: true}).status(201).json({"message": "User registered Successfully"})
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
        return res.status(400).json({ error: "Please provide the username or the email." }); // Use 400 for bad request
      }
      if (!user) {
        throw new CustomError("Invalid credentials", 401); // Use 401 for unauthorized
      }
      if(!user.blocked){
        const match = await bcrypt.compare(req.body.password, user.password); // Compare hashed password
      if (!match) {
        throw new CustomError("Invalid credentials", 401); // Use 401 for incorrect password
      }
  
      const { password, ...data } = user._doc;
      const token = jwt.sign({ _id: user._id },"vinay", { expiresIn: "3d" }); // Use env variable for secret
      res.cookie("token", token, { httpOnly: true }).status(200).json(data); // Set httpOnly for security
      }
      else{
        return res.status(425).json({"message":"Your account is blocked"})
      }
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ message: "Internal server error" }); // Generic error message
    }
  };
  const logoutUserController = async (req, res) => {
    try {
      // Check if the cookie exists before clearing
      if (!req.cookies.token) {
        return res.status(401).json({ message: "User not logged in" }); // 401 for unauthorized
      }
  
      // Clear the token cookie securely if present
      res.clearCookie("token", {
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
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
      }
  
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(token, "vinay"); // Replace "vinay" with your actual secret key
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
  
        res.status(200).json(user);
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

  const updateUserProfile= async(req, res,next)=>{

  }
  
  const updateUserPhoneController= async(req,res,next)=>{

  }
  const updateUserEmailController= async(req, res,next)=>{

  }

  const updateUserProfilePicture= async(req, res,next)=>{

  }

  const avaibleUserUsernames= async(req, res,next)=>{

  }

  const updateUserUsernamesController= async(req,res,next)=>{

  }

  const resetUserPassword= async(req,res,next)=>{

  }

  const forgotUserPassword= async(req,res,next)=>{
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
    
      const token = jwt.sign({ _id: user._id },"vinayForgotPassword", { expiresIn: "1d" }); // Use env variable for secret
      user.passwordResetToken= token;
      await user.save();
    
      // 5. Send Password Reset Email (replace with your email sending logic)
      await sendPasswordResetEmail(user.email,token); // Assuming sendPasswordResetEmail function exists
    
      return res.status(200).json({ message: "Password reset email sent successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred. Please try again later." });
    }
  }

  //todo we could add the functionality to send the reset password to the users phone no

  module.exports= {
    registerUserController,
     loginUserController,
     logoutUserController,
     avaibleUserUsernames,
     updateUserProfilePicture,
     updateUserEmailController,
     updateUserPhoneController,
     refetchUserController,
     updateUserProfile,
     updateUserUsernamesController,
     resetUserPassword,
     forgotUserPassword
    };
