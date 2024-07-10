const dotenv= require('dotenv')
const express= require('express')
const jwt= require('dotenv')
const Project= require('../../models/Project')
const User= require('../../models/User')
const Admin= require('../../models/admin')

const ReqCompleteProjectController= async(req,res,next)=>{
    try{
        const adminToken = req.params;
        const {projectId}= req.body;
        if(!projectId){
            return res.status(401).json({"message": "Project Id is not defined"})
        }
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
        // going to find the details of the Projects
        const project= await Project.findOneById(projectId);
        if(!project){
                return res.status(404).json({"message": "Project not found"})
        } 
        const userId= project.projectUploadedBy;
        const user= await User.findOneById(userId);
        const email= user.email;
        const username= user.username;
        const updateProjectEmail= sendProjectReqEmail(email,username);
        if(!updateProjectEmail){
            return res.status(400).json({"message": "Error while requesting for update"})
        }
        return res.status(200).json({"message":"Project Update req send Successfully"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const DeleteProjectController= async(req,res,next)=>{
    try{
        const adminToken = req.params;
        const {projectId}= req.body;
        if(!projectId){
            return res.status(401).json({"message": "Project Id is not defined"})
        }
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
        // going to find the details of the Projects
        const project= await Project.findOneById(projectId);
        if(!project){
                return res.status(404).json({"message": "Project not found"})
        } 
        // going to delete the project
        const deleteProject= await Project.findOneAndDelete({_id: projectId});
        if(!deleteProject){
            return res.status(400).json({"message": 'Error while delting the project'})
        }
        return res.status(200).json({"message":"Project deleted Successfully"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const UploadProjectController= async(req,res,next)=>{
    try{
        const adminToken = req.params;
        const {projectName, description,gitRepo,privateProject,projectImage,techStack, noOfPages,projectOverView,...data}= req.body;
        const requiredFields= ['projectName','gitRepo','privateProject','projectImage','techStack', 'noOfPages', 'projectOverView','description'];
        const missingFields= requiredFields.filter((field)=>field== req.body[field]);

        if(missingFields.length){
            return res.status(401).json({ message: `Missing required fields: ${missingFields.join(', ')}` })
        }
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
        const newproject= new Project({
            "projectName": projectName,
            "gitRepo": gitRepo,
            "privateProject": privateProject,
            "projectImage": projectImage,
            "techStack": techStack,
            "noOfPages": noOfPages,
            "projectOverView": projectOverView,
            "description": description,
            "adminUploaded": decodedData._id,
            ...data
        });
        await newproject.save();
        return res.status(200).json({'message': "New Project Created Successfully"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const UpdateProjectController=async(req,res,next)=>{
    try{
        const {projectId, adminToken}= req.params;
        const {updatedData } = req.body;
        if(!projectId || !updatedData){
            return res.status(401).json({'messsage': "All the credentials are not found"});
        }
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
        // gonna to find the project
        const project= await Project.findOne({adminUploaded: decodedData._id})
        if(!project){
            return res.status(404).json({"message": "Project not found"});
        }
        let updatedProject = await Project.findByIdAndUpdate(projectId, updatedData, { new: true });
        if (!updatedProject) {
            return res.status(400).json({ message: "Failed to update Project" });
        }
        return res.status(200).json({ message: "Project updated successfully", "updatedProject": updatedProject });    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

module.exports= {
    ReqCompleteProjectController,
    DeleteProjectController,
    UploadProjectController,
    UpdateProjectController
}