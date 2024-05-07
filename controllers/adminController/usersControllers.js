const mongoose= require("mongoose")
const bcrypt= require("bcryptjs")
const jwt=  require("jsonwebtoken");
const User= require("../../models/User");
const Admin= require("../../models/admin");
const dotenv= require("dotenv")
const { passwordsetEmail } = require("../authEmailSenders/forgotPasswordEmailSender");
const { welcomeUserEmail } = require("../authEmailSenders/UserEmail");

dotenv.config();
// only the delete Account Controller is left

const createUserAccountController = async (req, res) => {
    try {
      // Separate JWT verification
      const adminToken = req.cookies.adminToken;
      const {username, email } = req.body;
      if (!adminToken) {
        return res.status(401).json({"message": "Admin Token not found"}) // 401 for unauthorized access
      }
  
      const decodedData = jwt.verify(adminToken, process.env.ADMIN_TOKEN);
      const admin= Admin.findOne({_id: decodedData._id})
      if(!admin){
        return res.status(409).json({
          "message": "Admin not found"
        })
      }
      // Admin authorization
      if (!admin.approvedadmin && !admin.userAccess ) {
        return res.status(403).json({ message: "You are not authorized to create users" });
      }  
      // Validate and hash password
      if ( !username || !email) {
        return res.status(409).json({"message": "Please provide the email and the password"})
      }
  
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists" }); // Use 409 for conflict
      }
      const saltRounds = 10; // Adjust based on security requirements (higher for more security)
      const hashedPassword = await bcrypt.hash(username, saltRounds);

      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        ...req.body
        // blocked: false by default (unless intended for specific scenarios)
      });
      await newUser.save(); // Assuming User model has a save() method
      
      admin.createdUser.push(newUser._id)
      await admin.save();
      const passwordtoken = jwt.sign({ _id: newUser._id },process.env.PASSWORD_RESET_TOKEN, { expiresIn: "1d" }); // Use env variable for secret
      newUser.passwordResetToken= passwordtoken;
      await newUser.save();
      const passwordResetEmail= await passwordsetEmail(username,email,"www.google.com");
      if(!passwordResetEmail){
        return res.status(436).json({"message": "Unable to verify Email"})
      }
      const welcomeuser= await welcomeUserEmail(email,username, "www.google.com");
        if(welcomeuser){
          console.log("welcome mail send to the user")
        }
        else{
          console.log("welcome mail not send");
        }
      return res.status(201).json({ message: "User registered Successfully" });
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  
    const blockUserAccountController = async (req, res, next) => {
        try {
          // Separate JWT verification
          const adminToken = req.cookies.adminToken;
          const {userId}= req.body;

          if (!adminToken) {
            throw new CustomError("Admin please login", 401); // 401 for unauthorized access
          }
      
          const decodedData = jwt.verify(adminToken, process.env.ADMIN_TOKEN);
          const admin= await Admin.findOne({_id: decodedData._id});
          if(!admin){
            return res.status(409).json({"message": "Admin not found"})
          }
          // Admin authorization
          if (!admin.userAccess && !admin.approvedadmin ) {
            return res.status(403).json({ message: "You are not authorized to block users" });
          }
      
          const adminId = decodedData._id;
          // Find admin and user
          const user= await User.findById(userId);
          // Update user and admin
          user.blocked = true;
          await user.save(); // Assuming user model has a save() method
          admin.blockedUsers.push(user);
          await admin.save(); // Assuming admin model has a save() method
          return res.status(200).json({ message: "User blocked Succesfully" });
        } catch (err) {
          console.error(err); // Log specific error for debugging
          res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
        }
      };
      
      // Helper function to find user based on username or email
    
const deleteUserAccountController= async(req, res,next)=>{
    // todo we need to define the users course, messages, likes etc to be deleted

}

const accessUserAccountController = async (req, res, next) => {
    try {
      // Separate JWT verification
      const adminToken = req.cookies.adminToken;
      if (!adminToken) {
        return res.status(401).json({"message": "No Admin Token Found"}); // 401 for unauthorized access
      }
  
      const decodedData = jwt.verify(token,process.env.ADMIN_TOKEN);
      const admin= await Admin.findById(decodedData_id);
      if (!admin&& !admin.userAccess && !admin.approvedadmin) {
        return res.status(403).json({ message: "You are not authorized to access user information" });
      }
      // Search user by username or email
      const searchField = req.body.email || req.body.username;
      if (!searchField) {
        throw new CustomError("Admin please provide the username or email", 400);
      }
  
      const user = await User.findOne({ $or: [{ username: searchField }, { email: searchField }] });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
     const {password, ...data}= user._doc;
      res.status(200).json({ message: "Successfully found the user", data: data });
    
      admin.accessedUserAccount.push(user._id);
      await admin.save();
    } catch (err) {
      console.error(err); // Log specific error for debugging
      return res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  


module.exports= {
    createUserAccountController,
    blockUserAccountController,
    deleteUserAccountController,
    accessUserAccountController,
};