const mongoose= require("mongoose")
const Admin= require("../../models/admin")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcryptjs");
const { passwordsetEmail } = require("../authEmailSenders/forgotPasswordEmailSender");
const { sendAdminApllicationEmail } = require("../authEmailSenders/AdminEmail");

const applyForAdminController = async (req, res, next) => {
    try {
      const {adminname, adminemail, adminProfilePicture,adminmobileno, adminTechStack} = req.body;
  
      const existingAdmin = await Admin.findOne({ adminemail: adminemail });
      if( existingAdmin && existingAdmin.approvedadmin){
          return res.status(410).json({message: "You are already a Admin"})
      } // Assuming Admin model exists
      else if (existingAdmin) {
        return res.status(409).json({ message: "You are already applied for an admin" }); // Use 409 for conflict
      }
      if(adminname==undefined && adminemail==undefined && adminmobileno==undefined){
        return res.status(430).json({"error": "Please provide name , email, mobileno"})
      }
      const saltRounds = 10; // Adjust based on security requirements (higher for more security)
      const hashedPassword = await bcrypt.hash(adminname, saltRounds);
  
      const newAdmin = new Admin({
        approvedadmin: false,
        adminemail,
        adminpassword: hashedPassword,
        adminmobileno,
        adminProfilePicture
      });
      await newAdmin.save(); // Assuming Admin model has a save() method
      // going to create teh admin token
      const passwordToken=jwt.sign({_id: newAdmin._id}, "vinayAdminResetPassword", {expiresIn: "1d"});
      newAdmin.adminPasswordToken= passwordToken;
      await newAdmin.save();

      const passwordResetEmail= await passwordsetEmail(adminname, adminemail, "www.google.com")
      if(!passwordResetEmail){
        return res.status(436).json({"message": "Unable to verify Email"})
      }
      // going to create a tkoen for the admin auto login
      const adminToken= jwt.sign({_id: newAdmin._id}, "vinayAdmin", {expiresIn: "3d"})
      res.cookie("adminToken", adminToken, {httpOnly: true}).json({"messsage": "Admin Registered Successfully"})
      const welcomeAdmin= await sendAdminApllicationEmail(adminname, adminemail, "www.google.com")
      if(welcomeAdmin){
        console.log("welcome mail send to the Admin")
      }
      else{
        console.log("welcome mail not send");
      }
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  

module.exports= {applyForAdminController};