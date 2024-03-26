// here we are going to authenticate the user
const express = require("express");
const { registerUserController, loginUserController, logoutUserController, refetchUserController, updateUserProfile, updateUserEmailController, updateUserProfilePicture, updateUserUsernamesController, resetUserPassword, updateUserEmailGenerator, followUserController, unfollowUserController, blockUserController, updateUserPasswordController } = require("../controllers/authControllers/registerUserController");
const { registerBloggerController, loginBloggerController, logoutBloggerController, refetchBloggerController, updateBloggerProfileController, updateBloggerEmailController, updateBloggerPictureController, updateBloggerUsernameController, aviableBloggerUsernames, forgotBloggerPassword, resetBloggerPassword} = require("../controllers/authControllers/registerBloggerController");
const { registerTutorController, loginTutorController, logoutTutorController, refetchTutorController, getTutorPassword, resetTutorPassword, forgotTutorPassword } = require("../controllers/authControllers/registerTutorController");
const router= express.Router();

module.exports= router.post("/user/register", registerUserController);
module.exports= router.get("/user/login", loginUserController);
module.exports= router.get("/user/logout", logoutUserController);

module.exports= router.get("/user/fetch", refetchUserController);
module.exports= router.put("/user/updateProfile", updateUserProfile)
module.exports= router.put("/user/updatingEmail",updateUserEmailController)

module.exports= router.get("/user/updateEmailRequest", updateUserEmailGenerator);
module.exports= router.get("/user/updatePicture", updateUserProfilePicture)
module.exports= router.get("/user/updateUsername",updateUserUsernamesController);
// module.exports= router.get("/blogger/aviableUsernames", aviableUserUsernames);
module.exports= router.get("/user/resetPasswordRequest", resetUserPassword);
module.exports= router.post("/user/updatePasswordController", updateUserPasswordController)
module.exports= router.get("/user/followUser",followUserController);
module.exports= router.get("/user/unfollowUser", unfollowUserController);
module.exports= router.get("/user/blockUser", blockUserController);
// tested upto that


module.exports= router.post("/blogger/register", registerBloggerController);
module.exports= router.get("/blogger/login", loginBloggerController);
module.exports= router.get("/blogger/logout", logoutBloggerController);

module.exports=router.get("/blogger/fetch", refetchBloggerController);
module.exports= router.put("/blogger/updateProfile", updateBloggerProfileController)
module.exports= router.put("/blogger/updateEmail",updateBloggerEmailController)
module.exports= router.put("/blogger/updatePicture", updateBloggerPictureController)
module.exports= router.put("/blogger/updateUsername",updateBloggerUsernameController);

module.exports= router.get("/blogger/aviableUsernames", aviableBloggerUsernames)
module.exports= router.post("/blogger/forgotPassword",forgotBloggerPassword)
module.exports= router.get("/blogger/resetPassword", resetBloggerPassword)




module.exports= router.post("/tutor/register",registerTutorController);
module.exports= router.get("/tutor/login",loginTutorController);
module.exports= router.get("/tutor/logout", logoutTutorController);
module.exports= router.get("/tutor/fetch",refetchTutorController);
module.exports= router.put("/tutor/updateProfile", updateBloggerProfileController)
module.exports= router.put("/tutor/updateEmail",updateBloggerEmailController)
module.exports= router.put("/tutor/updatePicture", updateBloggerPictureController)
module.exports= router.put("/tutor/updateUsername",updateBloggerUsernameController);
module.exports= router.get("/tutor/aviableUsernames", aviableBloggerUsernames);
module.exports= router.get("/tutor/resetPassword", resetTutorPassword)
module.exports= router.post("/tutor/forgotPassword", forgotTutorPassword)
