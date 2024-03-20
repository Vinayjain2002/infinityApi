const mongoose= require("mongoose")
const bcrypt= require("bcryptjs")
const jwt=  require("jsonwebtoken");
const User= require("../models/User");

// only the delete Account Controller is left

const createUserAccountController = async (req, res) => {
    try {
      // Separate JWT verification
      const token = req.cookies.token;
      if (!token) {
        throw new CustomError("Admin please login", 401); // 401 for unauthorized access
      }
  
      const decodedData = await jwt.verify(token, "vinayadmin");
      // Admin authorization
      if (!decodedData.admin || !decodedData.admin.userAccess ) {
        return res.status(403).json({ message: "You are not authorized to create users" });
      }
      const adminId = decodedData.admin._id;
  
      // Validate and hash password
      const { password, username, email } = req.body;
      if (!password || !username || !email) {
        throw new CustomError("Please provide all required fields (username, email, password)", 400);
      }
  
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists" }); // Use 409 for conflict
      }
      const saltRounds = 10; // Adjust based on security requirements (higher for more security)
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        ...req.body
        // blocked: false by default (unless intended for specific scenarios)
      });
     decodedData.admin.createrdUser.push(newUser._id)
    await decodedData.admin.save();
      await newUser.save(); // Assuming User model has a save() method
  
      res.status(201).json({ message: "User registered Successfully" });
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  
    const blockUserAccountController = async (req, res, next) => {
        try {
          // Separate JWT verification
          const token = req.cookies.token;
          if (!token) {
            throw new CustomError("Admin please login", 401); // 401 for unauthorized access
          }
      
          const decodedData = await jwt.verify(token, "vinayadmin");
      
          // Admin authorization
          if (!decodedData.admin || !decodedData.admin.userAccess) {
            return res.status(403).json({ message: "You are not authorized to block users" });
          }
      
          const adminId = decodedData.admin._id;
      
          // Find admin and user
          const [admin, user] = await Promise.all([
            Admin.findOne({ _id: adminId }),
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
      if (!decodedData.admin || !decodedData.admin.userAccess) {
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
    accessUserAccountController
};