const mongoose= require("mongoose");
const express= require("express");
const { UploadProjectController, getAllProjectsController, getUserPrefProjectsController, getSpecificProjectController, changeProjectController, deleteProjectController, savedProjectsController, saveProjectController, getLimitProjectController, getNextProjectsController, getNextUserPrefProjectsController } = require("../../controllers/ProjectController/ProjectController");
const router= express.Router();

module.exports=router.post("/postProject", UploadProjectController);
module.exports= router.get("/getAllProject", getAllProjectsController);

module.exports= router.get("/userPrefProject", getUserPrefProjectsController);
module.exports = router.get("/nextUserPrefProjects", getNextUserPrefProjectsController);

// this route is to get all the details of the Specific Project
module.exports= router.get("/getSpecificProject",getSpecificProjectController);

module.exports= router.put("/changeProject", changeProjectController);
module.exports= router.delete("/deleteProject", deleteProjectController);

// we are going to define the route for the saved projects
module.exports= router.get("/savedProjects", savedProjectsController);
module.exports= router.put("/saveProject", saveProjectController);

// we are going to retrieve the data in teh some of the Subparts
module.exports=router.get("/limitedproject",getLimitProjectController);
module.exports= router.get("/nextProjects",getNextProjectsController);
