const mongoose= require("mongoose");
const express= require("express");
const { PostBootCamp, getAllBootcamps, getParticularBootcamp, getBootcampsByDate, userPreferenceBootcamp } = require("../../controllers/EventsController/BootcampsController");
const router= express.Router();

// now we are going to define the endpoints for the accessing the Bootcamps data
module.exports= router.post("/events/postBootcamp", PostBootCamp);
module.exports= router.get("/events/allBootcamp", getAllBootcamps);
module.exports= router.get("/events/bootcamp/:id", getParticularBootcamp);

module.exports= router.get("/events/bootcampByLocation", getBootcampsByDate);
module.exports= router.get("/events/userBootcamp", userPreferenceBootcamp);
