// here we are gonna to define the routes to access the Calendar 
const mongoose= require("mongoose")
const express= require("express")
const { PostEventsController, GetAllEventsController, GetEventsByDateController, DeleteEventController, GetAllEventInAmonthController } = require("../../controllers/Calendars/CalendarControllers")
const router= express.Router()

module.exports= router.post("/postEvent", PostEventsController)
module.exports= router.get("/getAll/:pageNo", GetAllEventsController)

module.exports= router.get("/byDate", GetEventsByDateController)
module.exports= router.delete("/delete/:eventId", DeleteEventController)

module.exports= router.get("/eventsInMonth", GetAllEventInAmonthController)
