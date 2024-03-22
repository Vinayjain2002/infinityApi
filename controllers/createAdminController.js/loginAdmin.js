const bcrypt= require("bcryptjs")
const Admin= require("../../models/admin")
const {CustomError}= require("../../middleWare/error")
const jwt= require("jsonwebtoken")
const LoginAsAdminController = async (req, res, next) => {
    try {
        const {adminpassword, adminemail}= req.body;
      const adminUser = await Admin.findOne({ adminemail }); // Assuming email is used for login
      if (!adminUser) {
        return res.status(401).json({ message: "Email not found" }); // More specific error
      }
      if(!adminUser.approvedadmin){
        return res.status(420).json({
          "message": "You are not a admin"
        })
      }if(!adminUser.approvedadmin){
        return res.status(420).json({
          "message": "You are not a admin"
        })
      }
      const match = await bcrypt.compare(adminpassword, adminUser.adminpassword); // Compare hashed password
  
      if (!match) {
        return new CustomError("Invalid Credentials", 401); // Use 401 for incorrect password
      }
      // we are going to define the code for the token
      const token= jwt.sign({_id: adminUser._id},"vinayadmin", {expiresIn: "1d"});
      res.cookie("token", token, {httpOnly: true});
        res.status(200).json({ message: "Welcome Back Admin"}); // Send token for further access
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };

module.exports= {LoginAsAdminController};
