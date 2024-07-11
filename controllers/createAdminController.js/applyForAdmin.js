const mongoose= require("mongoose")
const Admin= require("../../models/admin")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcryptjs");
const dotenv= require("dotenv")
dotenv.config();
const { passwordsetEmail } = require("../authEmailSenders/forgotPasswordEmailSender");
const { sendAdminApllicationEmail } = require("../authEmailSenders/AdminEmail");

const ApplyForAdminController = async (req, res, next) => {
    try {
      const {adminname, adminemail, adminProfilePicture,adminmobileno, adminTechStack,accessAppliedFor} = req.body;
  
      const existingAdmin = await Admin.findOne({ adminemail: adminemail });
      if( existingAdmin && existingAdmin.approvedadmin){
          return res.status(403).json({message: "You are already a Admin"})
      } // Assuming Admin model exists
      else if (existingAdmin) {
        return res.status(404).json({ message: "You are already applied for an admin" }); // Use 409 for conflict
      }
      if(adminname==undefined || adminemail==undefined || adminmobileno==undefined){
        return res.status(401).json({"error": "Please provide name , email, mobileno"})
      }
      const hashedPassword = await bcrypt.hash(adminname, process.env.SALT_ROUNDS);
      const passwordToken=jwt.sign({_id: newAdmin._id},process.env.ADMIN_PASSWORD_TOKEN, {expiresIn: "1d"});
      newAdmin.adminPasswordToken= passwordToken;
      const newAdmin = new Admin({
        approvedadmin: false,
        adminemail: adminemail,
        adminpassword: hashedPassword,
        adminmobileno: adminmobileno,
        adminProfilePicture: adminProfilePicture,
        adminTechStack: adminTechStack,
        accessAppliedFor: accessAppliedFor
      });
      await newAdmin.save(); // Assuming Admin model has a save() method
      // going to create teh admin token
      const passwordResetEmail= await passwordsetEmail(adminname, adminemail, "www.google.com")
      if(!passwordResetEmail){
        // we are gonna to delete the details of the applications
        await Admin.findOneAndDelete({'adminemail': adminemail });
        return res.status(400).json({"message": "Unable to verify Email"})
      }
      // going to create a tkoen for the admin auto login
      const welcomeAdmin= await sendAdminApllicationEmail(adminname, adminemail, "www.google.com")
      if(welcomeAdmin){
        console.log("welcome mail send to the Admin")
        return res.status(200).json({"message": "Applied Successfully"})
      }
      else{
        console.log("welcome mail not send");
        return res.status(201).json({"message": "Applied Successfully"})
      }
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status( 500).json({"message":"Internal Server Error" });
    }
  };
  

module.exports= {ApplyForAdminController};