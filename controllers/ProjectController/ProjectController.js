// here we are going to define the routes of the Projects
const mmongoose= require("mongoose");
const express= require("express");
const Project = require("../../models/Project")
const User= require('../../models/User')
const jwt= require("jsonwebtoken");
const UploadProjectController= async(req,res)=>{
    try{
        const {projectName, description,gitRepo,privateProject,projectImage,techStack, noOfPages,projectOverView,...data}= req.body;
        const requiredFields= ['projectName','gitRepo','privateProject','projectImage','techStack', 'noOfPages', 'projectOverView','description'];
        const missingFields= requiredFields.filter((field)=>field== req.body[field]);

        if(missingFields.length){
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` })
        }

        // weare going to store the data of the Projects
        const usertoken= req.cookies.usertoken;
        if(!usertoken){
            return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
        try{
            const decoded= jwt.verify(usertoken, "vinay");
            const userId= decoded._id;
            // now we are going to find out the details of teh user here extra like is he a valid user or not
            const user= User.findById(userId);
            if(!user){
                // so the user id not found
                return res.status(404).json({ message: "User not found" }); // Use 404 for not found
            }
            else if(user.blocked){
                // so the user is blocked so he is uable to post a event
                return res.status(405).json({
                    "message": "Your Account is blocked"
                  });
            }
            // we are going to store the data entered by the user and going to create a new object of the project and storeing the data 
            const newproject= new Project({
                "projectName": projectName,
                "gitRepo": gitRepo,
                "privateProject": privateProject,
                "projectImage": projectImage,
                "techStack": techStack,
                "noOfPages": noOfPages,
                "projectOverView": projectOverView,
                "description": description,
                "projectUploadedBy": userId,
                ...data
            });
            await newproject.save();
            // user.projectsUploaded.push(newproject._id);
            // await user.save();

            return res.status(200).json({"message": "Project Uploaded Successfully"});        
          }  
          catch(err){
            console.log(err);
            return res.status(410).json({"message": "Internal Server error"})
          }
        
    }
    catch(err){
        return res.status(500).json({
            "message": "Internal Server Error"
        })
    }
}


const getAllProjectsController= async(req,res,next)=>{
    try{
        const allProject= await Project.find({});
        if(!allProject && allProject.length==0){
            return res.status(204).json({ message: "No projects found" });
        }
        return res.status(200).json({ message: "Successfully fetched all Projects", data: allProject });
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}


const getUserPrefProjectsController= async(req,res,next)=>{
    try{
        const {projectName,projectLevel,techStack, projectAcheivements,tags}= req.body;
        let filters= [];
        // so if the length is not defined it will fetch the first 10
        if(projectName){
            filters.push({projectName});
        }
        if(projectLevel){
            filters.push({projectLevel});
        }
        if (projectAcheivements && projectAcheivements.length > 0) {
            filters.push({ projectAcheivements: { $in: projectAcheivements } }); // Match projects with at least one achievement from the list
        }
      
          // Handle tags (array of strings):
        if (tags && tags.length > 0) {
            filters.push({ tags: { $in: tags } }); // Match projects with at least one tag from the list
        }
        if(techStack && techStack.length>0){
            filters.push({techStack: {$in: techStack}});
        }
        // going to fetch the data based on the filters
        const findProjects= await Project.find({$and: filters}).limit(10);

        if(!findProjects || findProjects.length===0){
            return res.status(204).json({"message": "no Projects Find"})
        }
        return res.status(200).json({
            message: "Projects Ftched Succesfully",
            projects: findProjects
        });
    }
    catch(err){
        return res.status(500).json({
            "message": "Internal Server Errror"
        })
    }
}


const getNextUserPrefProjectsController= async(req,res,next)=>{
    try{
        const {projectName,projectLevel,techStack, projectAcheivements,tags, pageNo}= req.body;
        if(!pageNo){
            return res.status(401).json({"message": "Page no is missing"})
        }
        let filters= [];
        if(projectName){
            filters.push({projectName});
        }
        if(projectLevel){
            filters.push({projectLevel});
        }
        if (projectAcheivements && projectAcheivements.length > 0) {
            filters.push({ projectAcheivements: { $in: projectAcheivements } }); // Match projects with at least one achievement from the list
        }
      
          // Handle tags (array of strings):
        if (tags && tags.length > 0) {
            filters.push({ tags: { $in: tags } }); // Match projects with at least one tag from the list
        }
        if(techStack && techStack.length>0){
            filters.push({techStack: {$in: techStack}});
        }
        // going to fetch the data based on the filters
        const length= (pageNo-1)*10;
        const findProjects= await Project.find({$and: filters}).skip(length).limit(10);
        if(!findProjects || findProjects.length===0){
            return res.status(204).json({"message": "no Projects Find"})
        }
        return res.status(200).json({
            message: "Projects Ftched Succesfully",
            projects: findProjects
        });
    }
    catch(err){
        return res.status(500).json({
            "message": "Internal Server Errror"
        })
    }
}

const getSpecificProjectController=async(req,res,next)=>{
    try{
        // we are going to find out the Specific Projects for the user
        const {id}= req.body;
        if(!id){
            return res.status(400).json({
                "message": "Missing Project Id"
            });
        }
        const projectDetails= await Project.findById(id);
        if(!projectDetails){
            return res.status(404).json({"message": "No Project Find"});
        }
        return res.status(200).json({"message": "Projects Fetched Successfuly", data: projectDetails})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

// we are going to define the routes like the change the Project
const changeProjectController = async (req, res, next) => {
    try {
        const { projectId, updatedData } = req.body;
        // we are going to change the Project Details
        const usertoken = req.cookies.usertoken;
        if (!usertoken) {
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try {
            // we are going to find out the details of the user
            const decoded = jwt.verify(usertoken, "vinay");
            const userId = decoded._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else if (user.blocked) {
                return res.status(405).json({ message: "Your Account is blocked" });
            }
            // now we are going to check if the projectId is present in the user's uploaded Projects 
            const userProject = user.projectsUploaded;
            const projectExists = userProject.some((project) =>
                project._id.toString() === projectId.toString()
            );
            if (!projectExists) {
                return res.status(404).json({ message: "Project not found in your projects" });
            }
            let updatedProject = await Project.findByIdAndUpdate(projectId, updatedData, { new: true });
            if (!updatedProject) {
                return res.status(500).json({ message: "Failed to update Project" });
            }
            return res.status(200).json({ message: "Project updated successfully", updatedProject: updatedProject });
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// we are going to define the routes to delete the Project
const deleteProjectController= async(req,res,next)=>{
    try{
        // going to delete the Project Details
        const {projectId}= req.body;

        if(!projectId){
            return res.status(401).json({"message": "Project Id is missing"})
        }
        // we are going to change the Project Details
        const usertoken= req.cookies.usertoken;
        if(!usertoken){
            return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access 
        }
        const decoded= jwt.verify(usertoken, "vinay");
        const userId= decoded._id;
                // now we are going to find out the details of teh user here extra like is he a valid user or not
        const user=await User.findById(userId);
        if(!user){
                    // so the user id not found
            return res.status(404).json({ message: "User not found" }); // Use 404 for not found
        }
        else if(user.blocked){
                    // so the user is blocked so he is uable to post a event
            return res.status(405).json({
                "message": "Your Account is blocked"
                });
        }
    const userProjects = user.projectsUploaded || [];
    const projectIndex = userProjects.findIndex((project) => project.toString() === projectId); // Find project index

      if (projectIndex === -1) {
        return res.status(404).json({ message: "Project not found in your projects" });
      }

      // 6. Delete Project (Core Functionality)
      const deletedProject = await Project.findByIdAndDelete(projectId); // Assuming `YourModel` represents the project collection

      if (!deletedProject) {
        return res.status(500).json({ message: "Failed to delete project" });
      }

      // 7. Update User's Projects (Efficient Update with Pull Operator)
      const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { projects: projectId } }, { new: true }); // Efficient update with `pull`
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to remove project from your projects" });
      }
      return res.status(200).json({ message: "Project deleted successfully" });
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

const savedProjectsController = async (req, res, next) => {
    try {
        // here we are going to get the data that is saved by the user
        const usertoken = req.cookies.usertoken;
        if (!usertoken) {
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try {
            // we are going to find out the details of the user
            const decoded = jwt.verify(usertoken, "vinay");
            const userId = decoded._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else if (user.blocked) {
                return res.status(405).json({ message: "Your Account is blocked" });
            }

            // now we are going to get the details of the user's Saved Projects
            const savedProjects = user.savedProjects;
            const resultProjects = [];
            for (const item of savedProjects) {
                const project = await Project.findById(item._id);
                if (!project) {
                    continue;
                } else {
                    resultProjects.push(project);
                }
            }
            return res.status(200).json({ message: "Saved Projects fetched successfully", resultProjects });

        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const saveProjectController= async(req,res,next)=>{
    try{
        // here we are going to define the route to save the Projects for the users
        const {projectId}= req.body;
        if(!projectId){
            return res.status(404).json({"message": "Project id is missing"})
        }
        const usertoken= req.cookies.usertoken;
        if(!usertoken){
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try{
            const decoded = jwt.verify(usertoken, "vinay");
            const userId = decoded._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else if (user.blocked) {
                return res.status(405).json({ message: "Your Account is blocked" });
            }
            // we are going to define the code to save the project in the user profile
            user.savedProjects.push(projectId);
            await user.save();
            return res.status(200).json({"message": "Project saved Succesfully", data: user});
        }
        catch(err){
            return res.status(500).json({"message": "Internal Server Error"})
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const getNextProjectsController = async(req,res,next)=>{
    try{
        const usertoken= req.cookies.usertoken;
        const {pageNo}= req.body;
        if(!pageNo){
            return res.status(404).json({"message":"Page not is not find"});
        }
        if(!usertoken){
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try{
            const decoded = jwt.verify(usertoken, "vinay");
            const userId = decoded._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else if (user.blocked) {
                return res.status(405).json({ message: "Your Account is blocked" });
            }
            const skipLength= (pageNo-1)*10;
            // here we are going to fetch the new no of the newLength of the data 
            const projects=await Project.find({}).skip(skipLength).limit(10);
            if(!projects && projects.length==0){
                return res.status(401).json({"message": "No Project Found"});
            }
            return res.status(200).json({"message": "Projects Fetched Successfully", data: projects}); 
        }
        catch(err){
            return res.status(500).json({"message": "Internal Server Error"})
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}  

const getLimitProjectController= async(req,res,next)=>{
    try{
        // here we are going to define the route to save the Projects for the users
        const usertoken= req.cookies.usertoken;
        if(!usertoken){
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try{
            const decoded = jwt.verify(usertoken, "vinay");
            const userId = decoded._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else if (user.blocked) {
                return res.status(405).json({ message: "Your Account is blocked" });
            }
            // we are going to define teh code to retrive the data from the api
            const projects= await Project.find({}).limit(10);
            if(!projects&& projects.length==0){
                return res.status(401).json({"message": "No Project Found"});
            }        
            return res.status(200).json({"message": "Projects Fetched Successfully", data: projects}); 
        }
        catch(err){
            return res.status(500).json({"message": "Internal Server Error"})
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

 
const getProjectsByDateController = async () => {
    try {
  
      let pipeline = []; // Initialize empty pipeline
      let sortCriteria = {}; // Initialize empty sort criteria
  
      sortCriteria = { projectUploadedOn: -1 };
  
      pipeline.push({ $match: {} }); // Match all documents by default
      pipeline.push({ $limit: 10 });
      pipeline.push({ $sort: sortCriteria });
  
      // Fetch hackathons using aggregation pipeline
      const projects = await Project.aggregate(pipeline);
  
      if (!projects || projects.length === 0) {
        return res.status(204).json({ message: "No Projects found based on your criteria" });
      }
  
      return res.status(200).json({ message: "Projects fetched successfully", data: hackathons });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

const getNextProjectByDateController= async(req,res,next)=>{
    // here we are going to get the nextProjects Uploaded By the Date
    try {
        const {pageNo}= req.body;
        if(!pageNo){
            return res.status(404).json({"message": "Internal Server Error"});
        }
        let pipeline = []; // Initialize empty pipeline
        let sortCriteria = {}; // Initialize empty sort criteria
        const skipLength= (pageNo-1)*10;
        sortCriteria = { projectUploadedOn: -1 };
    
        pipeline.push({ $match: {} }); // Match all documents by default
        pipeline.push({ $skip: skipLength})
        pipeline.push({ $limit: 10 });
        pipeline.push({ $sort: sortCriteria });
    
        // Fetch hackathons using aggregation pipeline
        const projects = await Project.aggregate(pipeline);
    
        if (!projects || projects.length === 0) {
          return res.status(204).json({ message: "No Projects found based on your criteria" });
        }
    
        return res.status(200).json({ message: "Projects fetched successfully", data: hackathons });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
  }
  
module.exports= {
    UploadProjectController,
    getAllProjectsController,
    getUserPrefProjectsController
    ,deleteProjectController,
    
    changeProjectController, 
    getSpecificProjectController, 
    savedProjectsController,
    saveProjectController,
     getLimitProjectController,
    getNextProjectsController,
    getNextUserPrefProjectsController,

    // need to define the routes for those and need to be tested
    getNextProjectByDateController,
    getProjectsByDateController
};