const mongoose= require("mongoose");
const express= require("express");
const {  PostHackathonController,GetAllHackathonsController, GetParticularHackathonController, GetHackathonsByDateController,DeleteHackathonController,UpdateHacakathonController, SavedHackathonsController, SaveHackathonController,GetUserPrefHackathonsController,GetRandomHackathonsContoller } = require("../../controllers/EventsController/HackathonsController");
const router= express.Router();

// here we are going to define routes for the most important part ie for the hackathons
module.exports=router.post("/post/:userToken", PostHackathonController);
module.exports= router.get("/detail/:pageNo", GetAllHackathonsController);
module.exports= router.get("/specific/:hackathonId", GetParticularHackathonController);
module.exports= router.get("/byDate/:pageNo",GetHackathonsByDateController);
module.exports= router.delete("/delete/;userToken/:hackathonId", DeleteHackathonController);

module.exports= router.put("/update/:userToken/:hackathonId", UpdateHacakathonController);

module.exports= router.get("/saved/:userToken", SavedHackathonsController);
module.exports= router.put("/save/:userToken/:hackathonId", SaveHackathonController);
module.exports= router.get("/userPref/:pageNo", GetUserPrefHackathonsController)
module.exports= router.get("/random/:userToken/:pageNo",GetRandomHackathonsContoller);