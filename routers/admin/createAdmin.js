const express = require("express")
const {   CreateAdminController,UpdatePermissionController,DeleteAdminController,FetchAdminsController,FetchParticularAdminController,AdminApplicationController,DeleteAdminApplicationController} = require("../../controllers/createAdminController.js/createAdmin")
const { ApplyForAdminController } = require("../../controllers/createAdminController.js/applyForAdmin")
const { LoginAsAdminController } = require("../../controllers/createAdminController.js/loginAdmin")
const router= express.Router()

module.exports= router.post("/admin/apply",ApplyForAdminController)
module.exports= router.put("/admin/createAdmin", CreateAdminController)

// there is some error while updating the permission of the admin there is some eror in the acess Spelling
module.exports= router.put("/admin/updatePermission",UpdatePermissionController);

module.exports= router.delete("/admin/deleteAdmin", DeleteAdminController)
module.exports= router.get("/admin/application/all", AdminApplicationController)

module.exports= router.get("/admin/fetch/admin", FetchParticularAdminController);
module.exports= router.get("/admin/fetch/allAdmin", FetchAdminsController);
module.exports= router.get("/admin/login", LoginAsAdminController);
module.exports= router.delete("/admin/application/delete", DeleteAdminApplicationController)