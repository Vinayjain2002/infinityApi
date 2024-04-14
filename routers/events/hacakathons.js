const mongoose= require("mongoose");
const express= require("express");
const { getAllHackathons, PostHackathon, getParticularHackathon, getHackathonsByDate, getUserPreferenceHackathons } = require("../../controllers/EventsController/HackathonsController");
const router= express.Router();

// here we are going to define routes for the most important part ie for the hackathons
module.exports=router.post("/events/postHackathon", PostHackathon);
module.exports= router.get("/events/getHackathon", getAllHackathons);
module.exports= router.get("/events/hacakathon/:id", getParticularHackathon);
module.exports= router.get("/events/hackathon/date",getHackathonsByDate);
module.exports= router.get("events/userhackathon", getUserPreferenceHackathons);
