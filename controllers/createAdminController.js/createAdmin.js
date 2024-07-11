const mongoose= require("mongoose")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcryptjs");
const Admin = require("../../models/admin");
const dotenv= require("dotenv")
dotenv.config();


// api testing is left
const CreateAdminController = async (req, res, next) => {
    try {
      const adminToken= req.params;
      // these are the details of the Admin to whom we are gonna to make the admin
      const { adminemail, approvedadmin } = req.body;
      if(!adminemail || !approvedadmin || adminToken){
        return res.status(401).json({"message": "All the required fields are not found"});
      }
      let decoded=jwt.verify(adminToken,process.env.ADMIN_TOKEN);
      const adminId= decoded._id;
      const admin=await Admin.findById(adminId);
      if(!admin){
        return res.status(404).json({ message: "Admin not found" }); // Use 404 for not found
      }
      else if(!admin.approvedadmin){
        return res.status(404).json({"message": "You are not  approved as admin"})
      }
      else if(admin.deletedAdminAccount){
        return res.status(404).json({"message": "Admin Account is deleted"})
      }
      else if(!admin.createOtherAdmin){
        return res.status(404).json({
          "message": "You are not allowed to create other admins"
        })
      }
      const existingAdmin = await Admin.findOne({"adminemail": adminemail });
      if (!existingAdmin) {
        return res.status(404).json({ message: "Please first apply for admin" });
      }
      if (approvedadmin || existingAdmin.approvedadmin) {
        return res.status(400).json({ message: "You are already an approved admin" });
      }
  
      existingAdmin.approvedadmin = approvedadmin; // Set based on request body
      // Access Levels (Refactored logic)
      if (req.body.userAccess) existingAdmin.userAccess = req.body.userAccess;
      if (req.body.bloggerAccess) existingAdmin.bloggerAccess = req.body.bloggerAccess;
      if (req.body.tutorAccess) existingAdmin.tutorAccess = req.body.tutorAccess;

      if (req.body.blogsAccess) existingAdmin.blogsAccess = req.body.blogsAccess;
      if (req.body.courseAccess) existingAdmin.courseAccess = req.body.courseAccess;
      if (req.body.hackathonsAccess) existingAdmin.hackathonsAccess = req.body.hackathonsAccess;

      if (req.body.eventAccess) existingAdmin.eventAccess = req.body.eventAccess;
      if (req.body.bootcampAccess) existingAdmin.bootcampAccess = req.body.bootcampAccess;
      if (req.body.announcementAcess) existingAdmin.announcementAccess = req.body.announcementAccess;
      if(req.body.festAccess) existingAdmin.festAccess= req.body.festAccess;
      await existingAdmin.save();
      const {adminPasswordToken,adminMobileToken,adminpassword, ...data }= existingAdmin;
      return res.status(200).json({ message: "Admin successfully approved" ,"data": existingAdmin });
    } catch (err) {
      res.status( 500).json({"message":"Internal Server Error" });
    }
  };
  
  const UpdatePermissionController = async (req, res, next) => {
    try {
      const { email, ...accessUpdates } = req.body; // Destructure request body
      const adminToken= req.params;
      // these are the details of the Admin to whom we are gonna to make the admin
      if(!adminToken){
        return res.status(401).json({"message": "Admin Please login"});
      }
      let decoded=jwt.verify(adminToken,process.env.ADMIN_TOKEN);
      const adminId= decoded._id;
      const admin=await Admin.findById(adminId);
      if(!admin || admin.deletedAdmin){
        return res.status(404).json({ message: "Admin not found" }); // Use 404 for not found
      }
      else if(!admin.approvedadmin){
        return res.status(410).json({"message": "You are not  approved as admin"})
      }
      else if(!admin.createOtherAdmin){
        return res.status(410).json({
          "message": "You are not allowed to create other admins"
        })
      }
      const existingAdmin = await Admin.findOne({ "adminemail": email });
      if (!existingAdmin) {
        return res.status(404).json({ message: "Please first apply for admin" });
      }
  
      // Update access levels using spread operator and destructuring
      existingAdmin.accessLevels = {
        ...existingAdmin.accessLevels,
        ...accessUpdates, // Existing properties will be overwritten if present in accessUpdates
      };
  
      await existingAdmin.save();
      return res.status(200).json({ message: "Admin permissions updated successfully" });
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(500).json({ "message": "Internal Server Error" });
    }
  };
  

const DeleteAdminController= async(req, res,next)=>{
    // here we are going to delete the admin
    try{
      // we are gonna to define the logic to just delete the 
      const adminToken= req.params;
      // these are the details of the Admin to whom we are gonna to make the admin
      const { adminemail} = req.body;
      if(!adminToken || adminemail){
        return res.status(401).json({"message": "Admin Please login"});
      }
      let decoded=jwt.verify(adminToken,process.env.ADMIN_TOKEN);
      const adminId= decoded._id;
      const admin=await Admin.findById(adminId);
      if(!admin){
        return res.status(404).json({ message: "Admin not found" }); // Use 404 for not found
      }
      else if(!admin.approvedadmin){
        return res.status(410).json({"message": "You are not  approved as admin"})
      }
      else if(!admin.createOtherAdmin){
        return res.status(410).json({
          "message": "You are not allowed to create other admins"
        })
      }
      const adminToBeDeleted= await Admin.findOne({adminemail: adminemail});
      if(!adminToBeDeleted){
        return res.status(404).json({"message": "Admin Does not exists"});
      }
      adminToBeDeleted.deletedAdminAccount= true;
      await adminToBeDeleted.save();
      return res.status(200).json({"message": "Admin Account Deleted Successfully"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

const FetchAdminsController = async (req, res, next) => {
    try {
      const adminToken= req.params;
      // these are the details of the Admin to whom we are gonna to make the admin
     if(!adminToken){
        return res.status(401).json({"message": "Admin Please login"});
      }
      let decoded=jwt.verify(adminToken,process.env.ADMIN_TOKEN);
      const adminId= decoded._id;
      const admin=await Admin.findById(adminId);
      if(!admin){
        return res.status(404).json({ message: "Admin not found" }); // Use 404 for not found
      }
      else if(!admin.approvedadmin){
        return res.status(410).json({"message": "You are not  approved as admin"})
      }
      else if(admin.deletedAdminAccount){
        return res.status(410).json({"message": "Admin Account is deleted"})
      }
      const approvedAdmins = await Admin.find({ approvedAdmin: true });
      const responseData = approvedAdmins.map(admin => ({
        _id: admin._id,
        email: admin.adminemail,
        ProfilePicture: admin.adminProfilePicture
      }));
      const totalAdmins = await Admin.countDocuments();
      return res.status(200).json({ message: "List of all approved admins", data: responseData, totalCount: totalAdmins });
    } catch (err) {
      console.error(err); // Log specific error for debugging
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const FetchParticularAdminController = async (req, res, next) => {
    try {

      const { adminemail } = req.body;
      const adminToken= req.params;
      // these are the details of the Admin to whom we are gonna to make the admin
      if(!adminToken || !adminemail){
        return res.status(401).json({"message": "Please Provide all valid Credentils"});
      }
      let decoded=jwt.verify(adminToken,process.env.ADMIN_TOKEN);
      const loggedInAdminId= decoded._id;
      const loggedInAdmin=await Admin.findById(loggedInAdminId);
      if(!loggedInAdmin){
        return res.status(404).json({ message: "Admin not found" }); // Use 404 for not found
      }
      else if(!loggedInAdmin.approvedadmin){
        return res.status(410).json({"message": "You are not  approved as admin"})
      }
      if(loggedInAdmin.deletedAdminAccount){
        return res.status(410).json({"message": "Admin Account is deleted"})
      }
      // Find admin by email
      const admin= await Admin.findOne({adminemail: adminemail})
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" }); // Use 404 for not found
      } 
      // Exclude sensitive data from response
      const { adminname, adminProfilePicture, adminBio, adminCoverPicture } = admin;
      const adminData = { "adminname": adminname,"profilePicture": adminProfilePicture,"bio": adminBio, "coverPicture": adminCoverPicture };        
      res.status(200).json({ message: "Successfully fetched admin data", data: adminData });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

const AdminApplicationController= async(req, res,next)=>{
  // we are gonna to define the data of the 
    try{
      const adminToken= req.params;
      // these are the details of the Admin to whom we are gonna to make the admin
      if(!adminToken){
        return res.status(401).json({"message": "Please Provide all valid Credentils"});
      }
      let decoded=jwt.verify(adminToken,process.env.ADMIN_TOKEN);
      const loggedInAdminId= decoded._id;
      const loggedInAdmin=await Admin.findById(loggedInAdminId);
      if(!loggedInAdmin){
        return res.status(404).json({ message: "Admin not found" }); // Use 404 for not found
      }
      else if(!loggedInAdmin.approvedadmin){
        return res.status(410).json({"message": "You are not  approved as admin"})
      }
      if(loggedInAdmin.deletedAdminAccount){
        return res.status(410).json({"message": "Admin Account is deleted"})
      }
      const adminApplication = await Admin.find({ approvedadmin: false });
      const responseData = adminApplication.map(admin => ({
        _id: admin._id,
        email: admin.adminemail,
        ProfilePicture: admin.adminProfilePicture
      }));
      res.status(200).json({ message: "List of all approved admins", "data": responseData });
    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
}

const DeleteAdminApplicationController= async(req,res,next)=>{
  try {
    // 1. Check for Admin Token and Extract Admin ID
    const adminToken = req.params;
    if (!adminToken) {
      return res.status(401).json({ message: "Admin authorization required" }); // Use 401 for unauthorized access
    }
  
    const { adminId } = req.body;
    if (!adminId) {
      return res.status(401).json({ message: "Missing admin ID in request body" }); // Use 400 for bad request
    }
  
    // 2. Verify Admin Token and Retrieve Logged-In Admin Details
    let decoded;
    try {
      decoded = jwt.verify(adminToken, process.env.ADMIN_TOKEN);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired admin token" });
    }
  
    const loggedInAdminId = decoded._id;
    const loggedInAdmin = await Admin.findById(loggedInAdminId);
    if (!loggedInAdmin) {
      return res.status(404).json({ message: "Logged-in admin not found" });
    }
  
    // 3. Authorization Checks for Logged-In Admin
    if (!loggedInAdmin.approvedAdmin || loggedInAdmin.deletedAdminAccount) {
      return res.status(410).json({ message: "You are not authorized to delete admins" });
    }
  
    if (!loggedInAdmin.createOtherAdmin) {
      return res.status(410).json({ message: "You are not allowed to manage other admins" }); // Use 403 for forbidden action
    }
  
    // 4. Search for Admin to Delete
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin to delete not found" });
    }
  
    // 5. Validation Checks for Admin to Delete
    if (admin.deletedAdminAccount) {
      return res.status(404).json({ message: "Admin account is already deleted" }); // Use 410 for gone
    }
  
    if (admin.approvedAdmin) {
      return res.status(400).json({ message: "Cannot delete approved admins" }); // Use 400 for bad request
    }
  
    // 6. Delete the Admin
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      return res.status(400).json({ message: "Error deleting admin" });
    }
  
    // 7. Success Response
    return res.status(200).json({ "message": "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err); // Log the error for debugging
    return res.status(500).json({ message: "Internal server error" }); // Generic error message for the user
  }
  
}
module.exports= {
    CreateAdminController,
    UpdatePermissionController,
    DeleteAdminController,
    FetchAdminsController,
    FetchParticularAdminController,
    AdminApplicationController,
    DeleteAdminApplicationController
};