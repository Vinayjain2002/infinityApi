// here we are gonna to define the routes for the Infinity Data
const express= require("express");
const { noOfUsersController, RegisteredUserInMonthController, registeredUserInMonthRangeController, RegisteredUserInYearController, noOfFestsControllers, todayPostedFestsController, todayLastDateToApplyFestController, LastWeekToApplyFestsController, FestUploadedInAMonthController, HackathonsPostedInMonthController, noOfHackathonsController, noOfTodayPostedBlogs, noOfBlogsController, registeredTodayBLoggersCountController, RegisteredBloggerInYearController, noOfBloggersController, registeredBloggerInMonthController, registeredBloggerInMonthRangeController, todayLastDateToApplyHackathonController, LastweekToApplyHackathonController, HackathonPostedInARangeController, todayPostedHackathonController, videoPostedInAmonthController, videoPostedLastYearController, noOfVideoController, todayPostedVideoController, TotalFestsInAParticularRangeController } = require("../../controllers/adminController/InfnityData");
const router= express.Router();

// we are gonna to define the routes for the Users
module.exports= router.get("/userCount/:pageNo", noOfUsersController);
module.exports= router.get("/user/registered/month/:pageNo", RegisteredUserInMonthController);
module.exports= router.get("/user/registered/month/range", registeredUserInMonthRangeController);
module.exports= router.get("/user/registered/year", RegisteredUserInYearController);
module.exports= router.get("/user/registered/today/:pageNo",registeredTodayUsersCountController);

// we are gonna to dedfine the routes fot teh Fests
module.exports= router.get("/fest/total/:pageNo", noOfFestsControllers);
module.exports= router.get("/fest/month/range/:pageNo", TotalFestsInAParticularRangeController)
module.exports= router.get("/fest/lastDate/today/:pageNo", todayLastDateToApplyFestController)
module.exports= router.get("/fest/lastDate/week/:pageNo", LastWeekToApplyFestsController);
module.exports= router.get("/fest/posted/today/:pageNo", todayPostedFestsController);
module.exports= router.get("/fest/uploaded/month/:pageNo", FestUploadedInAMonthController);

// WE ARE Gonna to deifne the routes for the Hackathons
module.exports= router.get("/hackathons/posted/month/:pageNo", HackathonsPostedInMonthController)
module.exports= router.get("/hackathons/total/:pageNo", noOfHackathonsController);
module.exports= router.get("/hackathons/lastDate/today/:pageNo", todayLastDateToApplyHackathonController);
module.exports= router.get("/hackathons/posted/today/:pageNo", todayPostedHackathonController);
module.exports= router.get("/hackathons/lastDate/week/:pageNo",LastweekToApplyHackathonController);
// this routes need to be defined
module.exports= router.get("/hackathons/posted/range",HackathonPostedInARangeController);

// we are gonna to define the routes for the Bloggers
module.exports= router.get("/blogger/registered/today/:pageNo", registeredTodayBLoggersCountController);
module.exports= router.get("/blogger/registered/year",RegisteredBloggerInYearController )
module.exports= router.get("/blogger/total/:pageNo", noOfBloggersController);
module.exports= router.get("/blogger/month/range", registeredBloggerInMonthRangeController);
module.exports= router.get("/blogger/month/:pageNo", registeredBloggerInMonthController);

// we are gonna to define the routes for the Blogs
module.exports= router.get("/blogs/posted/today/:pageNo", noOfTodayPostedBlogs);
module.exports= router.get("/blogs/total/:pageNo", noOfBlogsController);

//we are gonna to define the routes for the Videos Controller
module.exports= router.get("/video/posted/month", videoPostedInAmonthController);
module.exports= router.get("/video/posted/lastYear", videoPostedLastYearController);
module.exports= router.get("/video/total/:pageNo", noOfVideoController);
module.exports= router.get("/video/posted/today/:pageNo", todayPostedVideoController);
