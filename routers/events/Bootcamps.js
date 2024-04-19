const mongoose= require("mongoose");
const express= require("express");
const router= express.Router();
const {postBootCampController, getAllBootcampsController, getParticularBootcampController, getBootCampsByDateController, userPreferenceBootcampController, getNextUserPrefBootcampsController, deleteBootCampController, updateBootCampController, getLimitBootcampsController, getNextBootcampsByDateController, getNextBootcampsController, savedBootcampController, saveBootcampController, getRandomBootcampsContoller, getNextRandomBootcampsContoller} =require('../../controllers/EventsController/BootcampsController')
// now we are going to define the endpoints for the accessing the Bootcamps data
module.exports= router.post("/events/postBootcamp", postBootCampController);
module.exports= router.get("/events/allBootcamp", getAllBootcampsController);
module.exports= router.get("/events/bootcamp/:id", getParticularBootcampController);
module.exports= router.get("/events/bootcampByDate",getBootCampsByDateController);
module.exports= router.get("events/userPrefBootcamp",userPreferenceBootcampController);

module.exports= router.get("/events/userPrefBootcamp/:pageNo",getNextUserPrefBootcampsController);
module.exports= router.delete("/events/deleteBootcamps/:bootcampId", deleteBootCampController);

module.exports= router.put("/events/updateBootcamp/:bootcampId", updateBootCampController);
module.exports= router.get("/events/getBootcamp", getLimitBootcampsController);
module.exports= router.get("/events/getBootcamp/:pageNo", getNextBootcampsController);

module.exports= router.get("/events/bootcampsByDate/:pageNo", getNextBootcampsByDateController);
module.exports= router.get("/events/savedBootcamp", savedBootcampController);
module.exports= router.put("/events/saveBootcamp", saveBootcampController);

module.exports= router.get("/events/randomBootcamp",getRandomBootcampsContoller);
module.exports= router.get("/events/randomHackathons/:pageNo",getNextRandomBootcampsContoller);