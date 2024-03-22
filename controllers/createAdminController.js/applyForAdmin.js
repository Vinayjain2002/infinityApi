const mongoose= require("mongoose")
const Admin= require("../../models/admin")
const bcrypt= require("bcryptjs")

const applyForAdminController = async (req, res, next) => {
    try {
      const { adminemail, adminpassword,approvedadmin, ...data } = req.body;
  
      const existingAdmin = await Admin.findOne({ adminemail: adminemail });
      if( existingAdmin && existingAdmin.approvedadmin){
          return res.status(410).json({message: "You are already a Admin"})
      } // Assuming Admin model exists
      else if (existingAdmin) {
        return res.status(409).json({ message: "You are already applies for an admin" }); // Use 409 for conflict
      }
      const saltRounds = 10; // Adjust based on security requirements (higher for more security)
      const hashedPassword = await bcrypt.hash(adminpassword, saltRounds);
  
      const newAdmin = new Admin({
        approvedadmin: false,
        ...data, // Assuming relevant data for Admin model
        adminemail,
        adminpassword: hashedPassword,
      });
      await newAdmin.save(); // Assuming Admin model has a save() method

      res.status(201).json({ message: "Successfully applied for admin" });
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  

module.exports= {applyForAdminController};