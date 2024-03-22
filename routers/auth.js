// here we are going to authenticate the user
const express = require("express");
const { registerUserController, loginUserController, logoutUserController, refetchUserController, updateUserProfile, updateUserEmailController, updateUserProfilePicture, updateUserUsernamesController, resetUserPassword, updateUserEmailGenerator, followUserController, unfollowUserController, blockUserController } = require("../controllers/authControllers/registerUserController");
const { registerBloggerController, loginBloggerController, logoutBloggerController, refetchBloggerController, updateBloggerProfileController, updateBloggerEmailController, updateBloggerPictureController, updateBloggerUsernameController, aviableBloggerUsernames, forgotBloggerPassword, resetBloggerPassword} = require("../controllers/authControllers/registerBloggerController");
const { registerTutorController, loginTutorController, logoutTutorController, refetchTutorController, getTutorPassword, resetTutorPassword, forgotTutorPassword } = require("../controllers/authControllers/registerTutorController");
const router= express.Router();

module.exports= router.post("/user/register", registerUserController);
module.exports= router.get("/user/login", loginUserController);
module.exports= router.get("/user/logout", logoutUserController);

module.exports= router.get("/user/fetch", refetchUserController);
module.exports= router.put("/user/updateProfile", updateUserProfile)
module.exports= router.put("/user/updatingEmail",updateUserEmailController)

module.exports= router.put("/user/updateEmail", updateUserEmailGenerator);
module.exports= router.get("/user/updatePicture", updateUserProfilePicture)
module.exports= router.get("/user/updateUsername",updateUserUsernamesController);
// module.exports= router.get("/blogger/aviableUsernames", aviableUserUsernames);
module.exports= router.post("/user/resetPassword", resetUserPassword);
module.exports= router.get("/user/followUser",followUserController);
module.exports= router.get("/user/unfollowUser", unfollowUserController);
module.exports= router.get("/user/blockUser", blockUserController);




module.exports= router.post("/blogger/register", registerBloggerController);
module.exports= router.get("/blogger/login", loginBloggerController);
module.exports= router.get("/blogger/logout", logoutBloggerController);

module.exports=router.get("/blogger/fetch", refetchBloggerController);
module.exports= router.put("/blogger/updateProfile", updateBloggerProfileController)

const updateUserPasswordController=async(req, res,next)=>{
    try {
      // Check for token presence
      const {password, passwordtoken}= req.body;
      if (!passwordtoken) {
        return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
      }
  
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(passwordtoken, "vinayResetPassword"); // Replace "vinay" with your actual secret key
        const userId = decoded._id;
  
        // Fetch user data using findOne()
        const user = await User.findOne({ _id: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" }); // Use 404 for not found
        }
        else if(user.blocked){
          return res.status(405).json({
            "message": "Your Account is blocked"
          })
        }
        // so we had verified the newemail
        user.password= password;
        user.passwordResetToken="";
        user.save();
        return res.status(200).json("Password Updated Successfully")
      } catch (err) {
        console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
        // Handle specific errors (e.g., token expiration, database errors)
        if (err.name === 'JsonWebTokenError') {
       
  const updateUserPasswordController=async(req, res,next)=>{
    try {
      // Check for token presence
      const {password, passwordtoken}= req.body;
      if (!passwordtoken) {
        return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
      }
  
      // Validate token using JWT verify
      try {
        const decoded = jwt.verify(passwordtoken, "vinayResetPassword"); // Replace "vinay" with your actual secret key
        const userId = decoded._id;
  
        // Fetch user data using findOne()
        const user = await User.findOne({ _id: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" }); // Use 404 for not found
        }
        else if(user.blocked){
          return res.status(405).json({
            "message": "Your Account is blocked"
          })
        }
        // so we had verified the newemail
        user.password= password;
        user.passwordResetToken="";
        user.save();
        return res.status(200).json("Password Updated Successfully")
      } catch (err) {
        console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
        // Handle specific errors (e.g., token expiration, database errors)
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: "Unauthorized: Invalid token" });
        } else if (err.name === 'CastError') {
          return res.status(400).json({ message: "Invalid user ID" });
        } else {
          return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
        }
      }
    } catch (err) {
      console.error("Unhandled error in refetchUserController:", err);
      return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
    }
  }
   return res.status(401).json({ message: "Unauthorized: Invalid token" });
        } else if (err.name === 'CastError') {
          return res.status(400).json({ message: "Invalid user ID" });
        } else {
          return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
        }
      }
    } catch (err) {
      console.error("Unhandled error in refetchUserController:", err);
      return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
    }
  }

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
