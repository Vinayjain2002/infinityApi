const {CustomError} = require("../middleWare/error")
const UserData= require("../models/userData")
const jwt= require("jsonwebtoken")
const dotenv= require("dotenv")
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const User= require("../models/User")
dotenv.config();

const registerUserController = async (req, res) => {
  // we need to first check the email or the phone no first
    try {
        const { password, username, email } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email already exists" }); // Use 409 for conflict
        }
        const saltRounds = 10; // Adjust based on security requirements (higher for more security)
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

  const refetchUserController= async (req,res)=>{
    try{
      const token= req.cookies.token;
      if(!token){
        return new CustomError("Unauthorised User", 404);
      }
      jwt.verify(token,"vinay", {}, async(err, data)=>{
        if(err){
          return  new CustomError("Cookie not Found", 405)
        }
        else{
          try{
            const id= data._id;
            const user= User.findOne({_id: id})
            console.log(user)
            res.status(200).json(user);
          }
          catch(err){
            return new CustomError("Internal Server Error", 500);
          }
        }
      })
    }
    catch(err){
      res.status(500).json("Internal Server error")
    }
  }

  module.exports= {registerUserController, loginUserController,logoutUserController, refetchUserController};
