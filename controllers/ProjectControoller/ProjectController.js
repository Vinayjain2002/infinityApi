// here we are going to define the routes of the Projects
const mmongoose= require("mongoose");
const express= require("express");
const Project = require("../../models/Project")
const User= require('../../models/User')

const UploadProjectController= async(req,res)=>{
    try{
        const {projectName, gitRepo,privateProject,projectImage,techStack, noOfPages,projectOverView, ...data}= req.body;
        const requiredFields= ['projectName','gitRepo','privateProject','projectImage','techStack', 'noOfPages', 'projectOverView'];

        const missingFields= requiredFields.filter(field!= req.body[field]);
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
                ...data
            });
            await newproject.save();
            user.projectsUploaded.push(newproject._id);
            await user.save();

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
        const {projectName,projectLevel,techStack, projectAcheivements}= req.body;
        let filters= [];

        if(projectName){
            filters.push({projectName});
        }
        if(projectLevel){
            filters.push({projectLevel});
        }
        if(techStack){
            filters.push({techStack});
        }
        if(projectAcheivements){
            filters.push({projectAcheivements});
        }
        
        // going to fetch the data based on the filters
        const findProjects= await Project.find({$and: filters});

        if(!findProjects || findProjects.length==0){
            return res.status(204).json({"message": "no Projects Find"})
        }
        return res.status(200).json({
            message: "Projects Ftched Succesfully"
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
        const {id}= req.params;
        if(!id){
            return res.status(400).json({
                "message": "Missing Project Id"
            });
        }
        const projectDetails= await Project.findById(id);
        if(!projectDetails){
            return res.status(404).json({"message": "No Project Find"});
        }
        return res.status(200).json({"message": "Projects Fetched Successfuly"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

// we are going to define the routes like the change the Project
const changeProjectController= async(req,res,next)=>{
    try{
        // const updatedData = {
        //     age: 35, // send the updated Data like that
        //   };
        const {projectId, updatedData}= req.params;
        // we are going to change the Project Details
        const usertoken= req.cookies.usertoken;
        if(!usertoken){
            return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
        try{
            // we are going to find out the details of the user
            const decoded= jwt.verify(usertoken, "vinay");
            const userId= decoded._id;
            const user= User.findById(userId);

            if(!user){
                return res.status(404).json({ message: "User not found" }); // Use 404 for not found
            }
            else if(user.blocked){
                // so the user is blocked so he is uable to post a event
                return res.status(405).json({
                    "message": "Your Account is blocked"
                  });
            }
            // now we are going to check is the projectid is present the user uploaded Projects 
            const userProject= user.projectsUploaded;
            const projectExists= userProject.some((project)=> project.toString()=== projectId);
            if (!projectExists) {
                return res.status(404).json({ message: "Project not found in your projects" });
            }
            updatedProject= Project.findByIdAndUpdate(projectId, updatedData,{new: true})
            if (!updatedProject) {
                return res.status(500).json({ message: "Failed to update Project" });
              }
        
            return res.status(200).json({ message: "Project updated successfully", updatedProject: updatedProject });
        }
        catch(err){
            return res.status(500).json({"message": "Inernal Server Error"})
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}


// we are going to define the routes to delete the Project
const deleteProjectController= async(req,res,next)=>{
    try{
        // going to delete the Project Details
        const {projectId}= req.params;
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

module.exports= {UploadProjectController,getAllProjectsController,getUserPrefProjectsController,deleteProjectController,changeProjectController, getSpecificProjectController}