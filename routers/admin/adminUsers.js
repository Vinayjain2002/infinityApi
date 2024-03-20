const express= require("express")
const { blockUserAccountController, createUserAccountController, deleteUserAccountController, accessUserAccountController } = require("../../controllers/adminController/usersControllers")

module.exports= router.put("/admin/blockUser",blockUserAccountController)
module.exports= router.post("/admin/createUser", createUserAccountController);
// module.exports= router.delete("/admin/deletUser", deleteUserAccountController)
module.exports=router.get("/admin/accessUser", accessUserAccountController)