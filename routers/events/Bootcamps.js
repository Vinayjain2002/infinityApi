const mongoose= require("mongoose");
const express= require("express");
const router= express.Router();
const {postBootCampController, getAllBootcampsController, getParticularBootcampController, getBootCampsByDateController,  deleteBootCampController, updateBootCampController,  savedBootcampController, saveBootcampController, getRandomBootcampsContoller, getUserPrefBootcampsController} =require('../../controllers/EventsController/BootcampsController')
// now we are going to define the endpoints for the accessing the Bootcamps data

module.exports= router.post("/post", postBootCampController);
module.exports= router.get("/detail/:pageNo", getAllBootcampsController);
module.exports= router.get("/specific/:id", getParticularBootcampController);
module.exports= router.get("/date/:pageNo",getBootCampsByDateController);
module.exports= router.get("/userPref/:pageNo",getUserPrefBootcampsController);

module.exports= router.delete("/delete/:bootcampId", deleteBootCampController);
module.exports= router.put("/update/:bootcampId", updateBootCampController);

module.exports= router.get("/saved", savedBootcampController);
module.exports= router.put("/save/:bootcampId", saveBootcampController);

module.exports= router.get("/random/:pageNo",getRandomBootcampsContoller);
