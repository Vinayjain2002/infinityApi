const mongoose= require("mongoose");
const express= require("express");
const { postFestController, getAllFestsController, getParticularFestController, deleteFestController, updateFestController,  getFestsByDateController, getUserPreferenceFestsController, savedFestController, saveFestController, getRandomFestsContoller, getFestsByLocationController } = require("../../controllers/EventsController/FestConroller");
const router= express.Router();


module.exports= router.get("/post",postFestController)
module.exports= router.get("/detail/:pageNo", getAllFestsController);
module.exports= router.get("/specific/:festId", getParticularFestController);
module.exports= router.get("/byDate/:pageNo",getFestsByDateController);
module.exports= router.get("/userPref/:pageNo",getUserPreferenceFestsController);
module.exports= router.delete("/delete/:festId", deleteFestController);
module.exports= router.get("/byLocation/:pageNo",getFestsByLocationController);
module.exports= router.put("/update/:festId",updateFestController);
module.exports= router.get("/saved", savedFestController);
module.exports= router.put("/save/:festId", saveFestController);
module.exports= router.get("/random/:pageNo",getRandomFestsContoller);
