const bcrypt= require("bcryptjs")
const Admin= require("../../models/admin")
const {CustomError}= require("../../middleWare/error")
const jwt= require("jsonwebtoken");
const { loginAdminNotfyEmail } = require("../authEmailSenders/AdminEmail");

const LoginAsAdminController = async (req, res, next) => {
    try {
      const {adminpassword, adminemail}= req.body;
      const adminUser = await Admin.findOne({ adminemail }); // Assuming email is used for login
      if (!adminUser) {
        return res.status(401).json({ message: "Email not found" }); // More specific error
      }
      if(!adminpassword){
        return res.status(401).json({"message": "Password not found"})
      }
      if(!adminUser.approvedadmin){
        return res.status(420).json({
          "message": "You are not a admin"
        })
      }
      const match = await bcrypt.compare(adminpassword, adminUser.adminpassword); // Compare hashed password
  
      if (!match) {
        return new CustomError("Invalid Credentials", 401); // Use 401 for incorrect password
      }
      // we are going to define the code for the token
      const adminToken= jwt.sign({_id: adminUser._id},"vinayadmin", {expiresIn: "1d"});
      res.cookie("adminToken", adminToken, {httpOnly: true});
      const date = new Date();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours}:${minutes}:${ampm}`;
        
        // going to define the email for the Tutor login notification
        const emailSend=await loginAdminNotfyEmail(adminUser.adminemail, adminUser.adminname,formattedDate, formattedTime, process.env.PASSWORD_RESET_URL);
      if(emailSend){
        console.log("email also send");
      }
      else{
        console.log("email not send");
      }
        res.status(200).json({ message: "Welcome Back Admin"}); // Send token for further access
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };

module.exports= {LoginAsAdminController};
