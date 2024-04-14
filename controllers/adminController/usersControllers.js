const mongoose= require("mongoose")
const bcrypt= require("bcryptjs")
const jwt=  require("jsonwebtoken");
const User= require("../../models/User");
const Admin= require("../../models/admin");
const { passwordsetEmail } = require("../authEmailSenders/forgotPasswordEmailSender");
const { welcomeUserEmail } = require("../authEmailSenders/UserEmail");

// only the delete Account Controller is left

const createUserAccountController = async (req, res) => {
    try {
      // Separate JWT verification
      const adminToken = req.cookies.adminToken;
      if (!adminToken) {
        throw new CustomError("Admin please login", 401); // 401 for unauthorized access
      }
  
      const decodedData = await jwt.verify(adminToken, "vinayAdmin");
      const admin= Admin.findOne({_id: decodedData._id})
      if(!admin){
        return res.status(409).json({
          "message": "Admin not found"
        })
      }
      // Admin authorization
      if (!admin.approvedadmin || !admin.userAccess ) {
        return res.status(403).json({ message: "You are not authorized to create users" });
      }  
      // Validate and hash password
      const {username, email } = req.body;
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
     admin.createdUser.push(newUser._id)
      await admin.save();
      await newUser.save(); // Assuming User model has a save() method
      const passwordtoken = jwt.sign({ _id: newUser._id },"vinayResetPassword", { expiresIn: "1d" }); // Use env variable for secret
      newUser.passwordResetToken= passwordtoken;
      console.log(passwordtoken);
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
      res.status(201).json({ message: "User registered Successfully" });
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  
    const blockUserAccountController = async (req, res, next) => {
        try {
          // Separate JWT verification
          const adminToken = req.cookies.adminToken;
          if (!adminToken) {
            throw new CustomError("Admin please login", 401); // 401 for unauthorized access
          }
      
          const decodedData = await jwt.verify(adminToken, "vinayAdmin");
          const admin= Admin.findOne({_id: decodedData._id});
          if(!admin){
            return res.status(409).json({"message": "Admin not found"})
          }
          // Admin authorization
          if (!admin.userAccess && !admin.approvedadmin ) {
            return res.status(403).json({ message: "You are not authorized to block users" });
          }
      
          const adminId = decodedData._id;
      
          // Find admin and user
          const [ user] = await Promise.all([
            findTargetUser(req.body), // Helper function for user search
          ]);
      
          if (!admin) {
            throw new CustomError("Admin not found", 404);
          }
      
          if (!user) {
            throw new CustomError("User does not exist", 401);
          }
      
          // Update user and admin
          user.blocked = true;
          await user.save(); // Assuming user model has a save() method
      
          admin.blockedUsers.push(user);
          await admin.save(); // Assuming admin model has a save() method
      
          res.status(202).json({ message: "User blocked Succesfully" });
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
      const token = req.cookies.token;
      if (!token) {
        throw new CustomError("Admin please login", 401); // 401 for unauthorized access
      }
  
      const decodedData = await jwt.verify(token, "vinayadmin");
  
      // Admin authorization
      if (!decodedData.admin && !decodedData.admin.userAccess && !decodedData.admin.approvedadmin) {
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
    
      decodedData.admin.accessedUserAccount.push(user._id);
      decodedData.admin.save();
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  


async function findTargetUser(body) {
    if (body.username) {
      return User.findOne({ username: body.username });
    } else if (body.email) {
      return User.findOne({ email: body.email });
    } else {
      throw new CustomError("Admin please provide the email or the username", 400);
    }
}

module.exports= {
    createUserAccountController,
    blockUserAccountController,
    deleteUserAccountController,
    accessUserAccountController,
};