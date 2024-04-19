const mongoose= require("mongoose");
const express= require("express");
const { PostHackathonController, getAllHackathonsController, getParticularHackathonController, getHackathonsByDateController, getUserPreferenceHackathonsController, deleteHackathonController, updateHacakathonController, getLimitHackathonController, getNextHackathonsController, getNextHackathonByDateController, getNextUserPrefHackathonsController, saveHackathonController, getRandomHackathonsContoller, getNextRandomHackathonsContoller, savedHackathonsController } = require("../../controllers/EventsController/HackathonsController");
const router= express.Router();

// here we are going to define routes for the most important part ie for the hackathons
module.exports=router.post("/events/postHackathon", PostHackathonController);
module.exports= router.get("/events/getAllHackathon", getAllHackathonsController);
module.exports= router.get("/events/hacakathon/:id", getParticularHackathonController);
module.exports= router.get("/events/hackathonByDate",getHackathonsByDateController);
module.exports= router.get("events/userPrefHackathon", getUserPreferenceHackathonsController);
module.exports= router.get("/events/userPrefHackathon/:pageNo",getNextUserPrefHackathonsController);
module.exports= router.delete("/events/deleteHackathon/:hackathonId", deleteHackathonController);

module.exports= router.put("/events/updateHackathon/:hackathonId", updateHacakathonController);
module.exports= router.get("/events/getHackathon", getLimitHackathonController);
module.exports= router.get("/events/getHackathon/:pageNo", getNextHackathonsController);

module.exports= router.get("/events/hackathonByDate/:pageNo", getNextHackathonByDateController);
module.exports= router.get("/events/savedHackathon", savedHackathonsController);
module.exports= router.put("/events/saveHackathon", saveHackathonController);

module.exports= router.get("/events/randomHackathons",getRandomHackathonsContoller);
module.exports= router.get("/events/randomHackathons/:pageNo",getNextRandomHackathonsContoller);