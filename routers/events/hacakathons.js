const mongoose= require("mongoose");
const express= require("express");
const {  PostHackathonController,GetAllHackathonsController, GetParticularHackathonController, GetHackathonsByDateController,DeleteHackathonController,UpdateHacakathonController, SavedHackathonsController, SaveHackathonController,GetUserPrefHackathonsController,GetRandomHackathonsContoller } = require("../../controllers/EventsController/HackathonsController");
const router= express.Router();

// here we are going to define routes for the most important part ie for the hackathons
module.exports=router.post("/post", PostHackathonController);
module.exports= router.get("/detail/:pageNo", GetAllHackathonsController);
module.exports= router.get("/specific/:hackathonId", GetParticularHackathonController);
module.exports= router.get("/byDate/:pageNo",GetHackathonsByDateController);
module.exports= router.delete("/delete/:hackathonId", DeleteHackathonController);

module.exports= router.put("/update/:hackathonId", UpdateHacakathonController);

module.exports= router.get("/saved", SavedHackathonsController);
module.exports= router.put("/save/:hackathonId", SaveHackathonController);
module.exports= router.get("/userPref/:pageNo", GetUserPrefHackathonsController)
module.exports= router.get("/random/:pageNo",GetRandomHackathonsContoller);