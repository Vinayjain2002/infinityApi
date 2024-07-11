const express = require("express")
const {   CreateAdminController,UpdatePermissionController,DeleteAdminController,FetchAdminsController,FetchParticularAdminController,AdminApplicationController,DeleteAdminApplicationController} = require("../../controllers/createAdminController.js/createAdmin")
const { ApplyForAdminController } = require("../../controllers/createAdminController.js/applyForAdmin")
const { LoginAsAdminController } = require("../../controllers/createAdminController.js/loginAdmin")
const router= express.Router()

module.exports= router.post("/apply",ApplyForAdminController)
module.exports= router.put("/createAdmin/:adminToken", CreateAdminController)

// there is some error while updating the permission of the admin there is some eror in the acess Spelling
module.exports= router.put("/update/permission/:adminToken",UpdatePermissionController);

module.exports= router.delete("/delete/dmin/:adminToken", DeleteAdminController)
module.exports= router.get("/application/all/:adminToken", AdminApplicationController)

module.exports= router.get("/fetch/adminDetails/:adminToken", FetchParticularAdminController);
module.exports= router.get("/fetch/allAdmin/adminToken", FetchAdminsController);
module.exports= router.get("/login", LoginAsAdminController);
module.exports= router.delete("/delete/application/:adminToken", DeleteAdminApplicationController)