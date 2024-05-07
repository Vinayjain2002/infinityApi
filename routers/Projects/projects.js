const mongoose= require("mongoose");
const express= require("express");
const { UploadProjectController, getProjectsController, getUserPrefProjectsController, getSpecificProjectController, changeProjectController, deleteProjectController, savedProjectsController, saveProjectController, getProjectsByDateController } = require("../../controllers/ProjectController/ProjectController");
const router= express.Router();

module.exports=router.post("/post", UploadProjectController);
module.exports= router.get("detail/:pageNo", getProjectsController);

module.exports= router.get("/userPref", getUserPrefProjectsController);

module.exports= router.get("specific/:projectId",getSpecificProjectController);

module.exports= router.put("/update/:projectId", changeProjectController);
module.exports= router.delete("/delete/:projectId", deleteProjectController);
module.exports= router.get("/date/:pageNo",    getProjectsByDateController )
module.exports= router.get("/saved", savedProjectsController);
module.exports= router.put("/save/:projectId", saveProjectController);
