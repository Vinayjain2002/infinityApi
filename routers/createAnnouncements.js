const express= require("express")
const { createBlogsAnnouncements, createCourseAnnouncements } = require("../controllers/createAnnoucements/createAnnouncements");
const { ApproveBlogsAnnouncements, ApproveCoursesAnnouncements, createAnnouncementsController, approveHackathonsAnnouncementsController, approvefestAnnouncementsController, approveBootCampAnnouncementsController } = require("../controllers/adminController/approveAnnouncements");
const { createHackathonAnnouncement, createFestAnnouncement, createBootcampAnnouncement } = require("../controllers/createAnnoucements/festAnnouncements");
const router= express.Router()

// // these are the announcements that are going to be created by the tutors or teh bloggers
// module.exports= router.post("/blogger/Announcements",createBlogsAnnouncements)
// module.exports= router.post("/tutor/Announcemets", createCourseAnnouncements);
// module.exports= router.post("/hackathon/announcement", createHackathonAnnouncement)
// module.exports= router.post("/fest/announcement", createFestAnnouncement)
// module.exports= router.post("/bootcamp/announcement", createBootcampAnnouncement)

// // these are the announcements that are going to be approved by the admin itself
// module.exports= router.get("/admin/BlogsAnnouncement", ApproveBlogsAnnouncements);
// module.exports= router.get("/admin/CourseAnnouncement", ApproveCoursesAnnouncements)
// module.exports= router.get("/admin/hackathonAnnouncement",approveHackathonsAnnouncementsController)
// module.exports= router.get("/admin/festAnnouncement",approvefestAnnouncementsController)
// module.exports= router.get("/admin/bootcamp/Anncouncement", approveBootCampAnnouncementsController)

// // it is going to be created by the admin itself
// module.exports= router.post("/admin/createAnnouncement",createAnnouncementsController);
