const mongoose= require("mongoose")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcryptjs")
const {CustomError} = require("../middleWare/error")

const LoginAsAdminController = async (req, res, next) => {
    try {
        const {adminpassword, adminemail, approvedadmin, ...data}= req.body  
      const adminUser = await Admin.findOne({ adminemail }); // Assuming email is used for login
      if (!adminUser) {
        return res.status(401).json({ message: "Email not found" }); // More specific error
      }
      const match = await bcrypt.compare(adminpassword, adminUser.adminpassword); // Compare hashed password
  
      if (!match) {
        return new CustomError("Invalid Credentials", 401); // Use 401 for incorrect password
      }
        res.status(200).json({ message: "Welcome Back Admin", token }); // Send token for further access
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  


module.exports= {LoginAsAdminController};
