// here we are gonna to define the routes for the Infinity Data
const express= require("express");
const { NoOfUsersController, RegisteredUserInMonthController, RegisteredUserInMonthRangeController, RegisteredUserInYearController,RegisteredTodayUsersCountController, NoOfFestsControllers, TodayPostedFestsController, TodayLastDateToApplyFestController, LastWeekToApplyFestsController, FestUploadedInAMonthController, HackathonsPostedInMonthController, NoOfHackathonsController, NoOfTodayPostedBlogs, NoOfBlogsController, RegisteredTodayBLoggersCountController, RegisteredBloggerInYearController, NoOfBloggersController, RegisteredBloggerInMonthController, RegisteredBloggerInMonthRangeController, TodayLastDateToApplyHackathonController, LastweekToApplyHackathonController, HackathonPostedInARangeController, TodayPostedHackathonController, VideoPostedInAmonthController, videoPostedLastYearController, NoOfVideoController, TodayPostedVideoController, TotalFestsInAParticularRangeController } = require("../../controllers/adminController/InfnityData");
const router= express.Router();

// we are gonna to define the routes for the Users
module.exports= router.get("/userCount/:pageNo", NoOfUsersController);
module.exports= router.get("/user/registered/month/:pageNo", RegisteredUserInMonthController);
module.exports= router.get("/user/registered/month/range", RegisteredUserInMonthRangeController);
module.exports= router.get("/user/registered/year", RegisteredUserInYearController);
module.exports= router.get("/user/registered/today/:pageNo",RegisteredTodayUsersCountController);

// we are gonna to dedfine the routes fot teh Fests
module.exports= router.get("/fest/total/:pageNo", NoOfFestsControllers);
module.exports= router.get("/fest/month/range/:pageNo", TotalFestsInAParticularRangeController)
module.exports= router.get("/fest/lastDate/today/:pageNo", TodayLastDateToApplyFestController)
module.exports= router.get("/fest/lastDate/week/:pageNo", LastWeekToApplyFestsController);
module.exports= router.get("/fest/posted/today/:pageNo", TodayPostedFestsController);
module.exports= router.get("/fest/uploaded/month/:pageNo", FestUploadedInAMonthController);

// WE ARE Gonna to deifne the routes for the Hackathons
module.exports= router.get("/hackathons/posted/month/:pageNo", HackathonsPostedInMonthController)
module.exports= router.get("/hackathons/total/:pageNo", NoOfHackathonsController);
module.exports= router.get("/hackathons/lastDate/today/:pageNo", TodayLastDateToApplyHackathonController);
module.exports= router.get("/hackathons/posted/today/:pageNo", TodayPostedHackathonController);
module.exports= router.get("/hackathons/lastDate/week/:pageNo",LastweekToApplyHackathonController);
// this routes need to be defined
module.exports= router.get("/hackathons/posted/range",HackathonPostedInARangeController);

// we are gonna to define the routes for the Bloggers
module.exports= router.get("/blogger/registered/today/:pageNo", RegisteredTodayBLoggersCountController);
module.exports= router.get("/blogger/registered/year",RegisteredBloggerInYearController )
module.exports= router.get("/blogger/total/:pageNo", NoOfBloggersController);
module.exports= router.get("/blogger/month/range", RegisteredBloggerInMonthRangeController);
module.exports= router.get("/blogger/month/:pageNo", RegisteredBloggerInMonthController);

// we are gonna to define the routes for the Blogs
module.exports= router.get("/blogs/posted/today/:pageNo", NoOfTodayPostedBlogs);
module.exports= router.get("/blogs/total/:pageNo", NoOfBlogsController);

//we are gonna to define the routes for the Videos Controller
module.exports= router.get("/video/posted/month", VideoPostedInAmonthController);
module.exports= router.get("/video/posted/lastYear", videoPostedLastYearController);
module.exports= router.get("/video/total/:pageNo", NoOfVideoController);
module.exports= router.get("/video/posted/today/:pageNo", TodayPostedVideoController);
