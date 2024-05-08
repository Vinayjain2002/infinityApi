const mongoose= require("mongoose");
const express= require("express");
const { PostHackathonController, getAllHackathonsController, getParticularHackathonController, getHackathonsByDateController, getUserPreferenceHackathonsController, deleteHackathonController, updateHacakathonController, getLimitHackathonController, getNextHackathonsController, getNextHackathonByDateController, getNextUserPrefHackathonsController, saveHackathonController, getRandomHackathonsContoller, getNextRandomHackathonsContoller, savedHackathonsController, getUserPrefHackathonsController } = require("../../controllers/EventsController/HackathonsController");
const router= express.Router();

// here we are going to define routes for the most important part ie for the hackathons
module.exports=router.post("/post", PostHackathonController);
module.exports= router.get("/detail/:pageNo", getAllHackathonsController);
module.exports= router.get("/specific/:hackathonId", getParticularHackathonController);
module.exports= router.get("/byDate/:pageNo",getHackathonsByDateController);
module.exports= router.delete("/delete/:hackathonId", deleteHackathonController);

module.exports= router.put("/update/:hackathonId", updateHacakathonController);

module.exports= router.get("/saved", savedHackathonsController);
module.exports= router.put("/save/:hackathonId", saveHackathonController);
module.exports= router.get("/userPref/:pageNo", getUserPrefHackathonsController)
module.exports= router.get("/random/:pageNo",getRandomHackathonsContoller);