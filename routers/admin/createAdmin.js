const express = require("express")
const { createAdminController, updatePermissionController, deleteAdminController, AdminApplicationController, fetchParticularAdminController } = require("../../controllers/createAdminController.js/createAdmin")
const { applyForAdminController } = require("../../controllers/createAdminController.js/applyForAdmin")
const { LoginAsAdminController } = require("../../controllers/createAdminController.js/loginAdmin")
const router= express.Router()

module.exports= router.post("/admin/apply",applyForAdminController)
module.exports= router.put("/admin/createAdmin", createAdminController)

// there is some error while updating the permission of the admin there is some eror in the acess Spelling
module.exports= router.put("/admin/updatePermission",updatePermissionController);

module.exports= router.delete("/admin/deleteAdmin", deleteAdminController)
module.exports= router.get("/admin/allApplications", AdminApplicationController)

module.exports= router.get("/admin/fetchAdmin", fetchParticularAdminController);
module.exports= router.get("/admin/login", LoginAsAdminController);