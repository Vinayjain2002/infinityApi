const mongoose= require("mongoose");
const express= require("express");
const { postFestController, getAllFestsController, getParticularFestController, deleteFestController, updateFestController, getLimitFestsController, getNextFestsController, getFestsByDateController, getUserPreferenceFestsController, savedFestController, saveFestController, getRandomFestsContoller } = require("../../controllers/EventsController/FestConroller");
const router= express.Router();


module.exports= router.get("/events/postFest",postFestController)
module.exports= router.get("/events/getAllFest", getAllFestsController);
module.exports= router.get("/events/fest/:id", getParticularFestController);
module.exports= router.get("/events/festByDate",getFestsByDateController);
module.exports= router.get("events/userPrefFest/:pageNo",getUserPreferenceFestsController);
module.exports= router.delete("/events/deleteFest/:festId", deleteFestController);

module.exports= router.put("/events/updateFest/:festId",updateFestController);
module.exports= router.get("/events/getFest", getLimitFestsController);
module.exports= router.get("/events/getFest/:pageNo", getNextFestsController);

module.exports= router.get("/events/hackathonByDate/:pageNo", getNextFestsController);
module.exports= router.get("/events/savedHackathon", savedFestController);
module.exports= router.put("/events/saveHackathon", saveFestController);

module.exports= router.get("/events/randomHackathons/:pageNo",getRandomFestsContoller);
