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

const CreateUserAccountController = async (req, res) => {
    try {
      // Separate JWT verification
      const adminToken = req.params;
      const {username, email } = req.body;
      if (!adminToken) {
        return res.status(401).json({"message": "Admin Token not found"}) // 401 for unauthorized access
      }
  
      const decodedData = jwt.verify(adminToken, process.env.ADMIN_TOKEN);
      const admin= Admin.findOneById(decodedData._id);
      if(!admin){
        return res.status(404).json({
          "message": "Admin not found"
        })
      }
      // Admin authorization
      if (!admin.approvedadmin || !admin.userAccess || admin.deletedAdminAccount ) {
        return res.status(410).json({ message: "You are not authorized to create users" });
      }  

      // Validate and hash password
      if ( !username || !email) {
        return res.status(401).json({"message": "Please provide all Credentials"})
      }
  
      const existingUser = await User.findOne({ $or: [{ username: username }, {email: email }] });
      if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists" }); // Use 409 for conflict
      }
      const hashedPassword = await bcrypt.hash(username, process.env.SALT_ROUNDS);
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
        const deleteUser= await User.findOneAndDelete({_id: newUser._id});
        return res.status(400).json({"message": "Unable to create the account"})
      }
      const welcomeuser= await welcomeUserEmail(email,username, "www.google.com");
        if(welcomeuser){
          return res.status(200).json({"message": "User Created Successfully"})
        }
        else{
          return res.status(201).json({'message': "User Created Successfully"})
        }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
    const BlockUserAccountController = async (req, res, next) => {
        try {
          // Separate JWT verification
          const adminToken = req.params;
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
          if (!admin.approvedadmin || !admin.userAccess || admin.deletedAdminAccount ) {
            return res.status(410).json({ message: "You are not authorized to create users" });
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

const AccessUserAccountController = async (req, res, next) => {
    try {
      // Separate JWT verification
      const adminToken = req.params;
      if (!adminToken) {
        return res.status(401).json({"message": "No Admin Token Found"}); // 401 for unauthorized access
      }
  
      const decodedData = jwt.verify(token,process.env.ADMIN_TOKEN);
      const admin= await Admin.findById(decodedData._id);
      if(!admin){
        return res.status(404).json({"message": "Admin not found"})
      }
      if (!admin.approvedadmin || !admin.userAccess || admin.deletedAdminAccount ) {
        return res.status(410).json({ message: "You are not authorized to create users" });
      } 
      // Search user by username or email
      const searchField = req.body.email || req.body.username;
      if (!searchField) {
        return res.status(401).json({"message": "Please Provide either the username or the email"})
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
    CreateUserAccountController,
    BlockUserAccountController,
    AccessUserAccountController,
};