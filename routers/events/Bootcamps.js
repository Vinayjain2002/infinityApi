const mongoose= require("mongoose");
const express= require("express");
const router= express.Router();
const { PostBootCampController,GetAllBootcampsController,GetParticularBootcampController,GetBootCampsByDateController,DeleteBootCampController, UpdateBootCampController,SaveBootcampController,SavedBootcampController,GetUserPrefBootcampsController,GetRandomBootcampsContoller} =require('../../controllers/EventsController/BootcampsController')
// now we are going to define the endpoints for the accessing the Bootcamps data

module.exports= router.post("/post/:userToken", PostBootCampController);
module.exports= router.get("/detail/:pageNo", GetAllBootcampsController);
module.exports= router.get("/specific/:bootcampId", GetParticularBootcampController);
module.exports= router.get("/date/:pageNo",GetBootCampsByDateController);
module.exports= router.get("/userPref/:pageNo",GetUserPrefBootcampsController);

module.exports= router.delete("/delete/:userToken/:bootcampId", DeleteBootCampController);
module.exports= router.put("/update/:userToken/:bootcampId", UpdateBootCampController);

module.exports= router.get("/saved/:userToken", SavedBootcampController);
module.exports= router.put("/save/:userToken/:bootcampId", SaveBootcampController);

module.exports= router.get("/random/:pageNo",GetRandomBootcampsContoller);
