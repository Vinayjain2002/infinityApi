// here we are going to authenticate the user
const express= require('express');
const router= express.Router();
const { RegisterUserController,LoginUserController,RefetchUserController,UpdateUserProfileController, UpdateUserEmailController,UpdateUserEmailGenerator,FindUserByPrefixNameController,AvaibleUserUsernamesController, UpdateUserUsernamesController,UpdateUserPasswordController,FollowUserController,UnfollowUserController,ResetUserPassword,BlockUserController}= require('../controllers/authControllers/registerUserController')
const {RegisterBloggerController,RefetchBloggerController,LoginBloggerController,UpdateBloggerProfileController,UpdateBloggerEmailGenerator, UpdateBloggerEmailController, AviableBloggerUsernamesController,UpdateBloggerUsernameController, ResetBloggerPasswordController,FindBloggerByPrefixNameController, FindAllBloggersController,UpdateBloggerPasswordController} = require('../controllers/authControllers/registerBloggerController')

module.exports= router.post("/user/register",RegisterUserController); 
module.exports= router.post("/user/login", LoginUserController); 
module.exports= router.get("/user/aviableUsernames", AvaibleUserUsernamesController);
module.exports= router.get("/user/fetch/:userToken", RefetchUserController);
module.exports= router.put("/user/updateProfile/:userToken",UpdateUserProfileController);
module.exports= router.put("/user/updatingEmail/:userToken",UpdateUserEmailController);
// module.exports= router.put("/user/updatePicture",updateUserPicture);
module.exports= router.get("/user/updateEmailRequest/:userToken", UpdateUserEmailGenerator);
module.exports= router.get("/user/updateUsername/:userToken",UpdateUserUsernamesController);
module.exports= router.get("/blogger/aviableUsernames", AvaibleUserUsernamesController);
module.exports= router.get("/user/resetPasswordRequest", ResetUserPassword);
module.exports= router.post("/user/updatePasswordController/:passwordResetToken", UpdateUserPasswordController)
module.exports= router.get("/user/followUser/:userToken",FollowUserController);
module.exports= router.get("/user/unfollowUser/:userToken", UnfollowUserController);
module.exports= router.get("/user/blockUser/:userToken", BlockUserController);
module.exports= router.get('/user/findUser', FindUserByPrefixNameController)


module.exports= router.post("/blogger/register", RegisterBloggerController);
module.exports= router.get("/blogger/login", LoginBloggerController);
module.exports=router.get("/blogger/fetch/:bloggerToken", RefetchBloggerController);
module.exports= router.put("/blogger/updateProfile/:bloggerToken", UpdateBloggerProfileController)
module.exports= router.get("/blogger/updateEmailRequest/:bloggerToken", UpdateBloggerEmailGenerator);
module.exports= router.get("/blogger/findBloggers", FindBloggerByPrefixNameController);
module.exports= router.get("/blogger/findAllBloggers/:pageNo", FindAllBloggersController);
module.exports= router.put("/blogger/updateEmail/:bloggerToken",UpdateBloggerEmailController)
module.exports= router.put("/blogger/updateUsername/:bloggerToken",UpdateBloggerUsernameController);
module.exports= router.get("/blogger/aviableUsernames", AviableBloggerUsernamesController)
module.exports= router.post("/blogger/updatePassword",UpdateBloggerPasswordController)
module.exports= router.get("/blogger/resetPassword", ResetBloggerPasswordController)
