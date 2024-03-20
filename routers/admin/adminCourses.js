const express= require("express")
const { deleteCourseController, createCourseController, blockCourseController } = require("../../controllers/adminController/coursesController")

module.exports= router.delete("/admin/deleteCourse",deleteCourseController)
module.exports= router.post("/admin/createCourse", createCourseController)
module.exports= router.put("/admin/blockCourse", blockCourseController)

module.exports= router.delete("/admin/deleteCourseVideos", deleteCourseController)
