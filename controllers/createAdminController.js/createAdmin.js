const mongoose= require("mongoose")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcryptjs");
const Admin = require("../../models/admin");


const createAdminController = async (req, res, next) => {
    try {
      const { adminemail, approvedadmin } = req.body;
  
      const existingAdmin = await Admin.findOne({ adminemail });
      if (!existingAdmin) {
        return res.status(406).json({ message: "Please first apply for admin" });
      }
      if(!approvedadmin){
        return res.status(435).json({"message": "Please Either approve the admin or reject it"});
      }
      if (approvedadmin && existingAdmin.approvedadmin) {
        return res.status(409).json({ message: "You are already an approved admin" });
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
  
      // Implement notification logic in a separate function/service
      // sendNotification(existingAdmin); // Example function call
  
      res.status(200).json({ message: "Admin successfully approved" ,data: existingAdmin });
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  
  const updatePermissionController = async (req, res, next) => {
    try {
      const { email, ...accessUpdates } = req.body; // Destructure request body
  
      const existingAdmin = await Admin.findOne({ email });
      if (!existingAdmin) {
        return res.status(406).json({ message: "Please first apply for admin" });
      }
  
      // Update access levels using spread operator and destructuring
      existingAdmin.accessLevels = {
        ...existingAdmin.accessLevels,
        ...accessUpdates, // Existing properties will be overwritten if present in accessUpdates
      };
  
      await existingAdmin.save();
  
      // Implement notification logic in a separate function/service
      // sendNotification(existingAdmin); // Example function call
  
      res.status(200).json({ message: "Admin permissions updated successfully" });
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  

const deleteAdminController= async(req, res,next)=>{
    // here we are going to delete the admin
}

const fetchAdminsController = async (req, res, next) => {
    try {
      const approvedAdmins = await Admin.find({ approvedAdmin: true });

      const responseData = approvedAdmins.map(admin => ({
        _id: admin._id,
        email: admin.adminemail,
        ProfilePicture: admin.adminProfilePicture
      }));
      res.status(200).json({ message: "List of all approved admins", data: responseData });
    } catch (err) {
      console.error(err); // Log specific error for debugging
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  const fetchParticularAdminController = async (req, res, next) => {
    try {
      const { adminemail } = req.body;
  
      // Find admin by email
      const admin = await Admin.findOne({ adminemail });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" }); // Use 404 for not found
      }
      console.log(admin);
  
      // Check approval status (if applicable)
      if (!admin.approvedadmin) {
        return res.status(403).json({ message: "Unauthorized access to admin data" }); // Use 403 for forbidden access
      }
  
      // Exclude sensitive data from response
      const adminData = { ...admin._doc };
      delete adminData.adminpassword; // Avoid sending password information
  
      res.status(200).json({ message: "Successfully fetched admin data", data: adminData });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

const AdminApplicationController= async(req, res,next)=>{
    try{
         const adminApplication = await Admin.find({ approvedadmin: false });

      const responseData = adminApplication.map(admin => ({
        _id: admin._id,
        email: admin.adminemail,
        ProfilePicture: admin.adminProfilePicture
      }));
      res.status(200).json({ message: "List of all approved admins", data: responseData });
    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
}
module.exports= {
    createAdminController,
    updatePermissionController,
    deleteAdminController,
    fetchAdminsController,
    fetchParticularAdminController,
    AdminApplicationController
};