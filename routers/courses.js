const express= require("express")
const { createCourseController, updateCourseDescription, updateCourseVideos, deleteCourseController, getAllCourses, searchTopicCourses, relatedTopicCourses, courseVideosController, putCourseVideosController, deleteVideosCotnroller } = require("../controllers/course/course")
const router= express.Router()

// module.exports= router.post("/tutor/createCourse", createCourseController)
// module.exports= router.put("/tutor/updateCourseDesc", updateCourseDescription)
// module.exports= router.put("/tutor/updateCourseVideos", updateCourseVideos)

// module.exports= router.delete("/tutor/deleteCourseController", deleteCourseController)
// module.exports= router.get("/tutor/allCourses/:length", getAllCourses)

// module.exports= router.get("/tutor/searchTopicCourses", searchTopicCourses)
// module.exports= router.get("/tutor/relatedTopicCourses/",relatedTopicCourses)


// module.exports= router.get("/tutor/courseVideos", courseVideosController)
// module.exports= router.get("/tutor/nextCourseVideos/:length")

// module.exports= router.put("/tutor/putVideos",putCourseVideosController )
// module.exports= router.delete("/tutor/deleteVideos", deleteVideosCotnroller);