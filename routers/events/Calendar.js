// here we are gonna to define the routes to access the Calendar 
const mongoose= require("mongoose")
const express= require("express")
const { PostEventsController, GetAllEventsController, GetEventsByDateController, DeleteEventController, GetAllEventInAmonthController } = require("../../controllers/Calendars/CalendarControllers")
const router= express.Router()

module.exports= router.post("/post/:userToken", PostEventsController)
module.exports= router.get("/detail/:userToken/:pageNo", GetAllEventsController)

module.exports= router.get("/byDate/:userToken", GetEventsByDateController)
module.exports= router.delete("/delete/:userToken/:eventId", DeleteEventController)

module.exports= router.get("/eventsInMonth/:userToken/:pageNo", GetAllEventInAmonthController)
