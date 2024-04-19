const mongoose= require("mongoose");
const express= require("express");
const router= express.Router();


module.exports= router.post("/events/postFest", PostFest);
module.exports= router.get("/events/getFests", getAllFests);
module.exports= router.get("/event/festByDate", getFestsByDate);
module.exports= router.get("/events/festsByLocation", getFestsByLocation)
module.exports= router.get("/events/userFests", getUserPreferenceFests);
module.exports= router.get("/events/particularFests", getFestById);
