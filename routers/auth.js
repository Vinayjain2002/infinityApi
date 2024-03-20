// here we are going to authenticate the user
const express= require("express");
const router= express.Router();

module.exports= router.post("/user/register", registerUserController);
module.exports= router.get("/user/login", loginUserController);
module.exports= router.get("/user/logout", logoutUserController);
module.exports= router.get("/user/fetch", refetchUserController);


module.exports= router.post("/blogger/register", registerBloggerController);
module.exports= router.get("/blogger/login", loginUserController);
module.exports= router.get("/blogger/logout", logoutBloggerController);
module.exports=router.get("/blogger/fetch", refetchBloggerController);


module.exports= router.post("/tutor/register", registerBloggerController);
module.exports= router.get("/tutor/login",loginTutorController);
module.exports= router.get("/tutor/logout", logoutBloggerController);
module.exports= router.get("/tutor/fetch",refetchTutorController);