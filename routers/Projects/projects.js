const mongoose= require("mongoose");
const express= require("express");
const {  UploadProjectController,GetUserPrefProjectsController,DeleteProjectController, ChangeProjectController,    GetSpecificProjectController,  SavedProjectsController,saveProjectController,GetProjectsController,GetProjectsByDateController} = require("../../controllers/ProjectController/ProjectController");
const router= express.Router();

module.exports=router.post("/post", UploadProjectController);
module.exports= router.get("detail/:pageNo", GetProjectsController);

module.exports= router.get("/userPref", GetUserPrefProjectsController);

module.exports= router.get("specific/:projectId",GetSpecificProjectController);

module.exports= router.put("/update/:projectId", ChangeProjectController);
module.exports= router.delete("/delete/:projectId", DeleteProjectController);
module.exports= router.get("/date/:pageNo",    GetProjectsByDateController )
module.exports= router.get("/saved", SavedProjectsController);
module.exports= router.put("/save/:projectId", saveProjectController);
