const express= require("express");
const router= express.Router();
const { BlockUserAccountController, AccessUserAccountController, CreateUserAccountController } = require("../../controllers/adminController/usersControllers")

module.exports= router.put("/blockUser/:adminToken",BlockUserAccountController)
module.exports= router.post("/admin/createUser/:adminToken", CreateUserAccountController);
// module.exports= router.delete("/admin/deletUser", deleteUserAccountController)
module.exports=router.get("/admin/accessUser/:adminToken", AccessUserAccountController)
