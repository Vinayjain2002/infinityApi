// here we are going to authenticate the user
const express= require('express');
const router= express.Router();
const { RegisterUserController,LoginUserController,RefetchUserController,UpdateUserProfileController, UpdateUserEmailController,UpdateUserEmailGenerator,FindUserByPrefixNameController,AvaibleUserUsernamesController, UpdateUserUsernamesController,UpdateUserPasswordController,FollowUserController,UnfollowUserController,ResetUserPassword,BlockUserController}= require('../controllers/authControllers/registerUserController')
const {RegisterBloggerController,RefetchBloggerController,LoginBloggerController,UpdateBloggerProfileController,UpdateBloggerEmailGenerator, UpdateBloggerEmailController, AviableBloggerUsernamesController,UpdateBloggerUsernameController, ResetBloggerPasswordController,FindBloggerByPrefixNameController, FindAllBloggersController,UpdateBloggerPasswordController} = require('../controllers/authControllers/registerBloggerController')
module.exports= router.post("/user/register",RegisterUserController);
module.exports= router.post("/user/login", LoginUserController);
module.exports= router.get("/user/aviableUsernames", AvaibleUserUsernamesController);
module.exports= router.get("/user/fetch", RefetchUserController);
module.exports= router.put("/user/updateProfile",UpdateUserProfileController);
module.exports= router.put("/user/updatingEmail",UpdateUserEmailController);
// module.exports= router.put("/user/updatePicture",updateUserPicture);
module.exports= router.get("/user/updateEmailRequest", UpdateUserEmailGenerator);
module.exports= router.get("/user/updateUsername",UpdateUserUsernamesController);
module.exports= router.get("/blogger/aviableUsernames", AvaibleUserUsernamesController);
module.exports= router.get("/user/resetPasswordRequest", ResetUserPassword);
module.exports= router.post("/user/updatePasswordController", UpdateUserPasswordController)
module.exports= router.get("/user/followUser",FollowUserController);
module.exports= router.get("/user/unfollowUser", UnfollowUserController);
module.exports= router.get("/user/blockUser", BlockUserController);
module.exports= router.get('/user/findUser', FindUserByPrefixNameController)


module.exports= router.post("/blogger/register", RegisterBloggerController);
module.exports= router.get("/blogger/login", LoginBloggerController);
module.exports=router.get("/blogger/fetch", RefetchBloggerController);
module.exports= router.put("/blogger/updateProfile", UpdateBloggerProfileController)
module.exports= router.get("/blogger/updateEmailRequest", UpdateBloggerEmailGenerator);
module.exports= router.get("/blogger/findBloggers", FindBloggerByPrefixNameController);
module.exports= router.get("/blogger/findAllBloggers", FindAllBloggersController);
module.exports= router.put("/blogger/updateEmail",UpdateBloggerEmailController)
module.exports= router.put("/blogger/updateUsername",UpdateBloggerUsernameController);
module.exports= router.get("/blogger/aviableUsernames", AviableBloggerUsernamesController)
module.exports= router.post("/blogger/updatePassword",UpdateBloggerPasswordController)
module.exports= router.get("/blogger/resetPassword", ResetBloggerPasswordController)
