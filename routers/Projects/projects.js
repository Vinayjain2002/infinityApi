const mongoose= require("mongoose");
const express= require("express");
const {  UploadProjectController,GetUserPrefProjectsController,DeleteProjectController, ChangeProjectController,    GetSpecificProjectController,  SavedProjectsController,saveProjectController,GetProjectsController,GetProjectsByDateController} = require("../../controllers/ProjectController/ProjectController");
const router= express.Router();

module.exports=router.post("/post/:userToken", UploadProjectController);
module.exports= router.get("detail/:userToken/:pageNo", GetProjectsController);

module.exports= router.get("/userPref/:pageNo", GetUserPrefProjectsController);

module.exports= router.get("specific/:projectId",GetSpecificProjectController);

module.exports= router.put("/update/:userToken/:projectId", ChangeProjectController);
module.exports= router.delete("/delete/:userToken/:projectId", DeleteProjectController);
module.exports= router.get("/date/:pageNo",    GetProjectsByDateController )
module.exports= router.get("/saved/:userToken", SavedProjectsController);
module.exports= router.put("/save/:userToken", saveProjectController);
