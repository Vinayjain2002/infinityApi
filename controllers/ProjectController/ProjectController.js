// here we are going to define the routes of the Projects
const mmongoose= require("mongoose");
const express= require("express");
const Project = require("../../models/Project")
const User= require('../../models/User')
const jwt= require("jsonwebtoken");
const dotenv= require("dotenv")
dotenv.config();

const UploadProjectController= async(req,res)=>{
    try{
        const {projectName, description,gitRepo,privateProject,projectImage,techStack, noOfPages,projectOverView,...data}= req.body;
        const requiredFields= ['projectName','gitRepo','privateProject','projectImage','techStack', 'noOfPages', 'projectOverView','description'];
        const missingFields= requiredFields.filter((field)=>field== req.body[field]);

        if(missingFields.length){
            return res.status(401).json({ message: `Missing required fields: ${missingFields.join(', ')}` })
        }

        // weare going to store the data of the Projects
        const userToken= req.params;
        if(!userToken){
            return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
        try{
            const decoded= jwt.verify(userToken,process.env.USER_TOKEN );
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
            if(!privateProject){
                const welcomeuser= await ProjectUploaderWelcome(user.username, user.email);
                if(welcomeuser){
                    return res.status(200).json({"message": "Project Uploaded Successfully and Welcome Mail send"});        
              }
                else{
                    return res.status(201).json({"message": "Project Uploaded Successfully and Welcome Mail not send"});        
                }
            }
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




const GetUserPrefProjectsController= async(req,res,next)=>{
    try{
        const {projectName,projectLevel,techStack, projectAcheivements,tags}= req.body;
        const pageNo= req.params?.pageNo ?? 1;
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
        const skipLength= (pageNo-1)*10;
        const findProjects= await Project.find({$and: filters}).skip(skipLength).limit(10);
        if(!findProjects || findProjects.length===0){
            return res.status(404).json({"message": "no Projects Find"})
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


const GetSpecificProjectController=async(req,res,next)=>{
    try{
        // we are going to find out the Specific Projects for the user
        const {projectId}= req.params;

        if(!projectId){
            return res.status(401).json({
                "message": "Missing Project Id"
            });
        }
        const projectDetails= await Project.findById(projectId);
        if(!projectDetails){
            return res.status(404).json({"message": "No Project Find"});
        }
        return res.status(200).json({"message": "Projects Fetched Successfuly", "data": projectDetails})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

// we are going to define the routes like the change the Project
const ChangeProjectController = async (req, res, next) => {
    try {
        const {projectId, userToken}= req.params;
        const {updatedData } = req.body;
        if(!projectId || !updatedData){
            return res.status(401).json({'messsage': "All the credentials are not found"});
        }
        // we are going to change the Project Details
        if (!userToken) {
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try {
            // we are going to find out the details of the user
            const decoded = jwt.verify(userToken, process.env.USER_TOKEN);
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
                return res.status(400).json({ message: "Failed to update Project" });
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
const DeleteProjectController= async(req,res,next)=>{
    try{
        // going to delete the Project Details
        const {projectId,userToken}= req.params;

        if(!projectId){
            return res.status(401).json({"message": "Project Id is missing"})
        }
        // we are going to change the Project Details
        if(!userToken){
            return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access 
        }
        const decoded= jwt.verify(userToken, process.env.USER_TOKEN);
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
        return res.status(400).json({ message: "Failed to delete project" });
      }

      // 7. Update User's Projects (Efficient Update with Pull Operator)
      const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { projects: projectId } }, { new: true }); // Efficient update with `pull`
      if (!updatedUser) {
        return res.status(404).json({ message: "Failed to remove project from your projects" });
      }
      return res.status(200).json({ message: "Project deleted successfully" });
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

const SavedProjectsController = async (req, res, next) => {
    try {

        // here we are going to get the data that is saved by the user
        const userToken = req.params;
        if (!userToken) {
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try {
            // we are going to find out the details of the user
            const decoded = jwt.verify(userToken, process.env.USER_TOKEN);
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
        const userToken= req.params;
        if(!userToken){
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try{
            const decoded = jwt.verify(userToken,process.env.USER_TOKEN);
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

const GetProjectsController = async(req,res,next)=>{
    try{
        const userToken= req.params;
        const pageNo= req.params?.pageNo ?? 1;
        if(!userToken){
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try{
            const decoded = jwt.verify(userToken, process.env.USER_TOKEN);
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
            if(!projects || projects.length==0){
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

 
const GetProjectsByDateController = async () => {
    try {

        const pageNo= req.params?.pageNo ?? 1;
        const skipLength= (pageNo-1)*10;
      let pipeline = []; // Initialize empty pipeline
      let sortCriteria = {}; // Initialize empty sort criteria
      sortCriteria = { projectUploadedOn: -1 };
  
      pipeline.push({ $match: {} }); // Match all documents by default
      pipeline.push({$skip: skipLength})
      pipeline.push({ $limit: 10 });
      pipeline.push({ $sort: sortCriteria });
  
      // Fetch hackathons using aggregation pipeline
      const projects = await Project.aggregate(pipeline);
  
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: "No Projects found based on your criteria" });
      }
  
      return res.status(200).json({ message: "Projects fetched successfully", data: projects });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

module.exports= {
    UploadProjectController,
    GetUserPrefProjectsController,
    DeleteProjectController,
    ChangeProjectController,    
    GetSpecificProjectController, 
    SavedProjectsController,
    saveProjectController,
    GetProjectsController,
    GetProjectsByDateController
};