const mongoose= require("mongoose");
const express= require("express");
const { PostFestController,GetAllFestsController,GetUserPreferenceFestsController,DeleteFestController,UpdateFestController,GetParticularFestController,SaveFestController,SavedFestController,GetFestsByDateController, GetFestsByLocationController,  GetRandomFestsContoller} = require("../../controllers/EventsController/FestConroller");
const router= express.Router();


module.exports= router.get("/post",PostFestController)
module.exports= router.get("/detail/:pageNo", GetAllFestsController);
module.exports= router.get("/specific/:festId", GetParticularFestController);
module.exports= router.get("/byDate/:pageNo",GetFestsByDateController);
module.exports= router.get("/userPref/:pageNo",GetUserPreferenceFestsController);
module.exports= router.delete("/delete/:festId", DeleteFestController);
module.exports= router.get("/byLocation/:pageNo",GetFestsByDateController);
module.exports= router.put("/update/:festId",UpdateFestController);
module.exports= router.get("/saved", SavedFestController);
module.exports= router.put("/save/:festId", SaveFestController);
module.exports= router.get("/random/:pageNo",GetRandomFestsContoller);